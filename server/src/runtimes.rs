use crossbeam::channel;
use std::collections::HashMap;
use std::process::{Child, Command, Stdio};
use std::sync::mpsc::Receiver;
use std::io::Read;
use std::str;
use url::Url;

use crate::config::{Platform, Runtime};
use crate::runtimes;

pub struct RuntimesController {
    runtimes: Vec<Runtime>,
    app_root: String,
    handles: HashMap<String, Child>,
    uris: HashMap<String, Url>,
    rx: Receiver<RtControllerMsg>,
    tx_uri: channel::Sender<Url>,
}

fn get_runtime_names(runtimes: Vec<Runtime>) -> Vec<String> {
    runtimes.iter().map(|x| String::from(&x.name[..])).collect()
}

#[derive(Debug)]
pub enum RtControllerMsg {
    RestartAll,
    StopAll,
    StartAll,
    GetUri(String),
}

impl RuntimesController {
    pub fn new(
        v: Vec<Runtime>,
        app_root: String,
        rx: Receiver<RtControllerMsg>,
        tx_uri: channel::Sender<Url>,
    ) -> Self {
        let api_handles: HashMap<String, Child> = HashMap::new();
        let uris: HashMap<String, Url> = HashMap::new();
        
        RuntimesController {
            runtimes: v,
            app_root: app_root,
            handles: api_handles,
            uris: uris,
            rx: rx,
            tx_uri: tx_uri,
        }
    }
    
    pub fn monitor(mut self) -> Result<(), std::io::Error> {
        tokio::spawn(async move {
            loop {
                let msg = self.rx.recv().unwrap();
                match msg {
                    RtControllerMsg::RestartAll => self.restart_all().await.ok(),
                    RtControllerMsg::StopAll => self.stop_all().await.ok(),
                    RtControllerMsg::StartAll => self.launch_all().await.ok(),
                    RtControllerMsg::GetUri(x) => {
                        let uri = self.uris.get(&x).unwrap();
                        self.tx_uri.send(uri.clone()).unwrap_or_else(|err| panic!("{err}"));
                        Some(())
                    }
                };
            }
        });
        
        Ok(())
    }
    
    pub async fn launch(&mut self, name: String) -> Result<(), std::io::Error> {
        let runtimes: Vec<Runtime> = self
        .runtimes
        .clone()
        .into_iter()
        .filter(|x| x.name == name)
        .collect::<Vec<Runtime>>();
        
        let runtime = runtimes.get(0).unwrap().clone();
        
        let port = 0;
        let (handle, my_url) = match &runtime.platform {
            Platform::R => {
                let app_root = &self.app_root;
                let script_path_rel = runtime.script;
                let script_path = format!("{app_root}/{script_path_rel}");
                let mut handle = Self::start_r_api(&script_path, port);
                let mut buffer = [0; 70];
                
                handle.as_mut().unwrap().stderr.take().unwrap().read_exact(&mut buffer);
                
                let msg = str::from_utf8(&buffer).unwrap();
                let plumber_intro = "Running Plumber API at";
                let start_bytes = msg.find(plumber_intro).unwrap_or(0) +
                plumber_intro.len() + 1;
                let msg = &msg[start_bytes..];
                let end_bytes = msg.find(char::is_whitespace).unwrap_or(msg.len());
                let runtime_api_url = &msg[..end_bytes];
                
                (handle.unwrap(), runtime_api_url.to_owned())
            },            
            other => panic!("{:?} not implemented", other)
        };
        
        let url = Url::parse(&my_url).unwrap();
        let name2 = name.clone();
        println!("started api service for {} at {:?}", &name, url);
        
        self.handles.insert(name, handle);
        self.uris.insert(name2, url);
        
        Ok(())
    }
    
    pub async fn launch_all(&mut self) -> Result<(), std::io::Error> {
        let runtimes = self.runtimes.clone();
        let names = runtimes::get_runtime_names(runtimes);
        
        for name in names {
            self.launch(name).await?;
        }
        Ok(())
    }
    
    fn start_r_api(script: &str, port: u16) -> Result<Child, std::io::Error> {
        println!("about to call rscript {script}");
        Command::new("Rscript")
        .arg("-e")
        // .arg(format!("hal9:::h9_start('{script}', {port})"))
        .arg(format!("hal9:::h9_start('{script}', NULL)"))
        .stderr(Stdio::piped())
        .spawn()
    }
    
    pub async fn stop(&mut self, name: String) -> Result<(), std::io::Error> {
        let handle = self.handles.get_mut(&name).unwrap();
        match handle.kill() {
            Ok(()) => {
                self.handles.remove(&name);
                self.uris.remove(&name);
            }
            Err(e) => panic!("{:?}", e),
        };
        println!("killed api service for {}", name);
        Ok(())
    }
    
    pub async fn stop_all(&mut self) -> Result<(), std::io::Error> {
        let runtimes = self.runtimes.clone();
        let names = runtimes::get_runtime_names(runtimes);
        
        for name in names {
            self.stop(name).await?;
        }
        
        Ok(())
    }
    
    pub async fn restart_all(&mut self) -> Result<(), std::io::Error> {
        self.stop_all().await?;
        self.launch_all().await?;
        Ok(())
    }
}
