

use crossbeam::channel;
use std::collections::HashMap;
use std::process::{Child, Command, Stdio, ChildStderr};
use tokio::sync::mpsc::Receiver;
use std::io::Read;
use tokio::sync::mpsc;
use std::str;
use url::Url;
use std::io::ErrorKind;

use crate::config::{Platform, Runtime};
use crate::runtimes;
use crate::shutdown::Shutdown;

pub(crate) struct RuntimesController {
    runtimes: Vec<Runtime>,
    app_root: String,
    handles: HashMap<String, RuntimeHandle>,
    rx: Receiver<RtControllerMsg>,
    tx_uri: channel::Sender<Result<Url, std::io::Error>>,
    shutdown: Shutdown,
    _shutdown_complete_tx: mpsc::Sender<()>,
}

fn get_runtime_names(runtimes: Vec<Runtime>) -> Vec<String> {
    runtimes.iter().map(|x| String::from(&x.name[..])).collect()
}

#[derive(Debug)]
pub(crate) enum RtControllerMsg {
    RestartAll,
    StopAll,
    StartAll,
    GetUri(String),
}

#[derive(Debug)]
struct RuntimeHandle {
    pub handle: Child,
    pub startup_result: RuntimeStartupResult,
    _stderr: ChildStderr,
}

#[derive(Debug)]
enum RuntimeStartupResult {
    Success(String),
    Failure(String),
}

impl RuntimeHandle {
    fn get_url(&self) -> Result<Url, std::io::Error> {
        match &self.startup_result {
            RuntimeStartupResult::Success(url) => {
                Ok(url.parse().unwrap())
            },
            RuntimeStartupResult::Failure(error) => {
                Err(std::io::Error::new(ErrorKind::Other, error.to_owned()))
            }
        }
    }
    
    fn read_startup_result(mut handle: Child, intro: String) -> Self {
        let mut buf = [0; 64];
        let mut msg_vec = Vec::new();
        
        let pattern = format!("{intro} (http://*[^\\s]+)");
        let regex= regex::Regex::new(&pattern).unwrap();
        
        let mut stderr = handle.stderr.take().unwrap();
        
        let result = loop {
            
            let n = stderr.read(&mut buf).unwrap();
            
            if n == 0 {
                // nothing left to read and no Plumber startup message detected
                let msg = str::from_utf8(&msg_vec).unwrap().trim();
                break RuntimeStartupResult::Failure(msg.to_owned());
            }
            
            msg_vec.extend_from_slice(&buf[..n]);
            let msg = str::from_utf8(&msg_vec).unwrap();

            println!("stderr from runtime process: {msg}");
            let mat = regex.find(msg);
            
            if let Some(m) = mat {
                // Plumber startup message detected
                // let url = &msg[(m.start()+intro.len() + 1)..m.end() - 1];
                let url = &msg[(m.start()+intro.len() + 1)..m.end()];
                println!("startup message detected, url is {url}");
                break RuntimeStartupResult::Success(url.to_owned());
            };
        };

        RuntimeHandle {
            handle,
            startup_result: result,
            _stderr: stderr,
        }
    }
}

impl RuntimesController {
    pub(crate) fn new (
        v: Vec<Runtime>,
        app_root: String,
        rx: Receiver<RtControllerMsg>,
        tx_uri: channel::Sender<Result<Url, std::io::Error>>,
        shutdown: Shutdown,
        _shutdown_complete_tx: mpsc::Sender<()>
    ) -> Self {
        let api_handles: HashMap<String, RuntimeHandle> = HashMap::new();
        
        RuntimesController {
            runtimes: v,
            app_root,
            handles: api_handles,
            rx,
            tx_uri,
            shutdown,
            _shutdown_complete_tx,
        }
    }
    
    
    pub(crate) fn monitor(mut self) -> Result<(), std::io::Error> {
        tokio::spawn(async move {
            while !self.shutdown.is_shutdown() {
                
                tokio::select! {
                    msg = self.rx.recv() => {
                        if let Some(event) = msg {
                            match event {
                                RtControllerMsg::RestartAll => self.restart_all().await.ok().unwrap(),
                                RtControllerMsg::StopAll => self.stop_all().await.ok().unwrap(),
                                RtControllerMsg::StartAll => self.launch_all().await.ok().unwrap(),
                                RtControllerMsg::GetUri(x) => {
                                    let handle_ref = self.handles.get(&x);
                                    let url_result = handle_ref.as_ref().unwrap().get_url();
                                    println!("controller: sending back url_result {url_result:?}");
                                    self.tx_uri.send(url_result).ok();
                                }
                            }
                        }
                    }
                    _ = self.shutdown.recv() => {
                        self.stop_all().await.ok();
                    }
                }
                
            };
        });
        
        Ok(())
        
    }
    
    
    
    async fn launch(&mut self, name: String) -> Result<(), std::io::Error> {
        let runtimes: Vec<Runtime> = self
        .runtimes
        .clone()
        .into_iter()
        .filter(|x| x.name == name)
        .collect::<Vec<Runtime>>();
        
        let runtime = runtimes.get(0).unwrap().clone();
        
        let app_root = &self.app_root;
        let script_path_rel = runtime.script;
        
        let port = 0;
        let script_path = format!("{app_root}/{script_path_rel}");
        let runtime_handle = match &runtime.platform {
            Platform::R => {
                Self::start_r_api(&script_path, port)
            }            
            Platform::Python => {
                Self::start_python_api(&script_path, port)
            }
        };

        self.handles.insert(name, runtime_handle);
        
        Ok(())
    }
    
    async fn launch_all(&mut self) -> Result<(), std::io::Error> {
        let runtimes = self.runtimes.clone();
        let names = runtimes::get_runtime_names(runtimes);
        
        for name in names {
            self.launch(name).await?;
        }
        Ok(())
    }
    
    fn start_r_api(script: &str, port: u16) -> RuntimeHandle {
        let port_str = if port == 0 {
            String::from("NULL")
        } else {
            port.to_string()
        };
        
        let r_cmd = format!("hal9:::h9_run_script('{script}', {port_str})");
        
        let handle = Command::new("Rscript")
        .arg("-e")
        .arg(r_cmd)
        .stderr(Stdio::piped())
        .spawn().unwrap();

        RuntimeHandle::read_startup_result(handle, "Running plumber API at".to_owned())
    }
    
    fn start_python_api(script: &str, port: u16) -> RuntimeHandle {
        // let py_cmd = format!("import hal9; hal9.run_script('{script}', {port})");
        let py_cmd = format!("import hal9; hal9.run_script('{script}', {port})");
        println!("about to start python api: {py_cmd}");
        
        let handle = Command::new("python")
        .arg("-c")
        .arg(py_cmd)
        .stderr(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn().unwrap();

        RuntimeHandle::read_startup_result(handle, "Uvicorn running on".to_owned())
    }
    
    async fn stop(&mut self, name: String) -> Result<(), std::io::Error> {
        
        let runtime_handle = self.handles.get_mut(&name).unwrap();
        match runtime_handle.startup_result {
            RuntimeStartupResult::Success(_) => {
                match runtime_handle.handle.kill() {
                    Ok(()) => {
                        println!("killed api service for {}", name);
                    }
                    Err(e) => panic!("{e:?}"),
                }
            }
            RuntimeStartupResult::Failure(_) => {
                match runtime_handle.handle.try_wait() {
                    Ok(_) => {
                        println!("api service {name} successfully exited");
                    }
                    Err(e) => {
                        println!("api service {name} failed to wait: {e}");
                    }
                }
            }
        };

        self.handles.remove(&name);
        
        Ok(())
    }
    
    async fn stop_all(&mut self) -> Result<(), std::io::Error> {
        let runtimes = self.runtimes.clone();
        let names = runtimes::get_runtime_names(runtimes);
        
        for name in names {
            self.stop(name).await?;
        }
        
        Ok(())
    }
    
    async fn restart_all(&mut self) -> Result<(), std::io::Error> {
        self.stop_all().await?;
        self.launch_all().await?;
        Ok(())
    }
}
