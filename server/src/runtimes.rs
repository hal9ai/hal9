use actix_web::http::Uri;
use crossbeam::channel;
use std::collections::HashMap;
use std::process::{Child, Command};
use std::sync::mpsc::Receiver;

use crate::config::{Platform, Runtime};
use crate::runtimes;

pub struct RuntimesController {
    runtimes: Vec<Runtime>,
    handles: HashMap<String, Child>,
    uris: HashMap<String, Uri>,
    rx: Receiver<RtControllerMsg>,
    tx_uri: channel::Sender<Uri>,
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
        rx: Receiver<RtControllerMsg>,
        tx_uri: channel::Sender<Uri>,
    ) -> Self {
        let api_handles: HashMap<String, Child> = HashMap::new();
        let uris: HashMap<String, Uri> = HashMap::new();

        RuntimesController {
            runtimes: v,
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
                        Some(self.tx_uri.send(uri.clone()).unwrap())
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

        let port = 6080;
        let handle = match &runtime.platform {
            Platform::R => Self::start_r_api(&runtime.script, port),
            other => panic!("{:?} not implemented", other),
        };

        println!("started api service for {}", &name);

        let uri = Uri::builder()
            .scheme("http")
            .authority(format!("127.0.0.1:{port}"))
            .path_and_query("/")
            .build();
        let name2 = name.clone();

        self.handles.insert(name, handle.unwrap());
        self.uris.insert(name2, uri.unwrap());

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
        Command::new("Rscript")
            .arg("-e")
            .arg(format!("hal9:::h9_start_api_server('{script}', {port})"))
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
