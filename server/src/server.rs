use crate::config::Config;
use crate::manifest::*;
use crate::runtimes::{RtControllerMsg, RuntimesController};
use crate::shutdown::Shutdown;
use crate::util::{monitor_fs_changes, monitor_heartbeat, time_now};
use actix_files::NamedFile;
use actix_web::{web, HttpResponse, Responder, Result};
use crossbeam::channel as crossbeam_channel;
use crossbeam::channel::bounded;
use reqwest;
use serde_json;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicUsize, Ordering};
use tokio::sync::mpsc::channel;
use std::sync::Arc;
use url::Url;
use std::io::Write;
use tokio::signal;
use tokio::sync::{mpsc, broadcast};
use webbrowser;
use futures::stream::{self, StreamExt};
use json::object;
use serde::Deserialize;
use actix_multipart::Multipart;
use futures_util::TryStreamExt;

struct AppState {
    config: Config,
    app_dir: String,
    client_design_path: String,
    designer_string: String,
    tx_handler: tokio::sync::mpsc::Sender<RtControllerMsg>, 
    rx_uri_handler: crossbeam_channel::Receiver<Result<Url, std::io::Error>>,
    last_heartbeat: web::Data<AtomicUsize>,
}

fn options_for_client(data: web::Data<AppState>, mode: String) -> String {
    let options = object!{
        "mode": mode,
        "runtimes": [
            {
                "name": data.config.runtimes[0].name.to_string(),
                "platform": data.config.runtimes[0].platform.to_string(),
                "script": data.config.runtimes[0].script.to_string()
            }
        ]
    };

    let jsonopts: String = options.dump();

    data.designer_string.replace("__options__", &jsonopts)
}

async fn run(data: web::Data<AppState>) -> impl Responder {
    HttpResponse::Ok().body(options_for_client(data, "run".to_string()))
}

async fn design(data: web::Data<AppState>) -> impl Responder {
    HttpResponse::Ok().body(options_for_client(data, "design".to_string()))
}

async fn ping(data: web::Data<AppState>) -> impl Responder {
    data.last_heartbeat
    .fetch_update(Ordering::SeqCst, Ordering::SeqCst, |_| {
        Some(time_now().try_into().unwrap())
    })
    .ok();
    
    let timestamp = data.last_heartbeat.load(Ordering::Relaxed);
    
    HttpResponse::Ok().body(timestamp.to_string())
}

async fn get_config(data: web::Data<AppState>) -> impl Responder {
    let config = &data.config;
    HttpResponse::Ok().json(config)
}

async fn eval(
    data: web::Data<AppState>,
    req: web::Json<Manifests>,
) -> impl Responder {
    let tx_handler = &data.tx_handler;
    let rx_uri_handler = &data.rx_uri_handler;

    let results: Vec<Result<RuntimeResponse, std::io::Error>> = stream::iter(&req.manifests)
        .then(|m| async move {
        let rt = &m.runtime;
        let manifest = m.calls.clone();

        tx_handler.send(RtControllerMsg::GetUri(rt.to_string())).await.ok();

        match rx_uri_handler.recv().unwrap() {
            Ok(url) => {
                let uri = url.join("eval").unwrap();

                let client = reqwest::Client::new();

                let mut res = client
                    .post(uri)
                    .json(&manifest)
                    .send()
                    .await
                    .unwrap()
                    .json::<RuntimeResponse>()
                    .await
                    .unwrap();

                res.runtime = Some(rt.to_owned());
                Ok(res)

            }
            Err(e) => {
                Err(e)
            }
        }

    })
    .collect()
    .await;

    let errors: Vec<String> = results
        .iter()
        .filter(|res| res.is_err())
        .map(|e| e.as_ref().unwrap_err().to_string())
        .collect();

    if !errors.is_empty() {
        HttpResponse::BadRequest().body(errors.join("\\n"))
    } else {
        let res = ManifestResponse {
            responses: results.iter().map(|x| x.as_ref().unwrap().to_owned()).collect()
        };

        let response = serde_json::to_string(&res).unwrap();

        HttpResponse::Ok().body(response)
    }
}

async fn pipeline(data: web::Data<AppState>) -> Result<NamedFile> {
    let design_path = PathBuf::new()
    .join(&data.app_dir)
    .join(&data.client_design_path);
    Ok(NamedFile::open(design_path)?)
}

async fn pipeline_post(data: web::Data<AppState>, req: String) -> impl Responder {
    let design_path = Path::new(&data.app_dir).join(&data.client_design_path);
    let mut output = std::fs::File::create(design_path).unwrap();
    write!(output, "{}", req).ok();
    HttpResponse::Ok().body("{}")
}

#[derive(Deserialize)]
struct FileSpec {
    filepath: String,
}

async fn get_file(file_spec: web::Query<FileSpec>, data: web::Data<AppState>) -> Result<NamedFile> {
    let full_file_path = PathBuf::new()
        .join(&data.app_dir)
        .join(&file_spec.filepath);
    println!("trying to open file {full_file_path:?}");
    Ok(NamedFile::open(full_file_path)?)
}

async fn save_file(mut payload: Multipart, file_spec: web::Query<FileSpec>, data: web::Data<AppState>) -> Result<HttpResponse, actix_web::Error> {
    if let Some(mut field) = payload.try_next().await? {

        let relative_path_to_file = &file_spec.filepath;
        let app_dir = &data.app_dir;
        let path_to_file = format!("{app_dir}/{relative_path_to_file}");

        let mut f = web::block(|| std::fs::File::create(path_to_file)).await??;

        while let Some(chunk) = field.try_next().await? {
            f = web::block(move || f.write_all(&chunk).map(|_| f)).await??;
        }
    }

    Ok(HttpResponse::Ok().into())
}

#[tokio::main]
pub async fn start_server(app_path: String, port: u16, timeout: u32, nobrowse: bool) -> std::io::Result<()> {
    
    
    let (notify_shutdown, _) = broadcast::channel(1);
    let (shutdown_complete_tx, mut shutdown_complete_rx) = mpsc::channel::<()>(1);
    
    use actix_web::{web, App, HttpServer};
    
    let app_path_to_monitor = app_path.clone();
    let app_path_for_controller = app_path.clone();
    let app_path_data = app_path.clone();
    
    let config_path = PathBuf::new().join(app_path).join("hal9.toml");
    let conf = Config::parse(config_path);
    
    let (tx, rx) = channel(1);
    let (tx_uri, rx_uri) = bounded(0);
    let rx_uri_handler = rx_uri.clone();
    
    let rt_controller = RuntimesController::new(conf.runtimes.clone(), app_path_for_controller, rx, tx_uri, Shutdown::new(notify_shutdown.subscribe()), shutdown_complete_tx.clone());
    
    rt_controller.monitor().ok();
    
    let tx_fs = tx.clone();
    
    tx.send(RtControllerMsg::StartAll).await.ok();
    
    monitor_fs_changes(
        app_path_to_monitor, tx_fs, 
        Shutdown::new(notify_shutdown.subscribe()),
        shutdown_complete_tx.clone(),
    );
    
    let last_heartbeat = web::Data::new(AtomicUsize::new(time_now().try_into().unwrap()));
    let last_heartbeat_arc= Arc::clone(&last_heartbeat);
    
    
    let designer_bytes = include_bytes!("../resources/client.html");
    let designer_string: String = String::from_utf8_lossy(designer_bytes).to_string();
    
    let tx_handler = tx.clone();
    let http_server = HttpServer::new(move || {
        App::new()
        .app_data(web::Data::new(
            AppState {
                config: conf.clone(),
                app_dir: app_path_data.clone(),
                client_design_path: conf.client.design.clone(), 
                designer_string: designer_string.clone(),
                tx_handler: tx_handler.clone(),
                rx_uri_handler: rx_uri_handler.clone(),
                last_heartbeat: last_heartbeat.clone(),
            }
        ))
        .route("/pipeline", web::get().to(pipeline))
        .route("/pipeline", web::post().to(pipeline_post))
        .route("/design", web::get().to(design))
        .route("/config", web::get().to(get_config))
        .route("/", web::get().to(run))
        .route("/putfile", web::put().to(save_file))
        .route("/getfile", web::get().to(get_file))
        .service(web::resource("/ping").to(ping))
        .service(web::resource("/eval").route(web::post().to(eval)))
    })
    .disable_signals()
    .bind(("127.0.0.1", port))
    .unwrap();
    
    let myport = http_server.addrs().pop().unwrap().port();
    let myurl = format!("http://127.0.0.1:{myport}/design");
    let http_server = http_server.run();
    
    let http_server_handle = http_server.handle();
    
    let tx_heartbeat = tx.clone();
    
    monitor_heartbeat(http_server_handle, last_heartbeat_arc, timeout, tx_heartbeat,
        Shutdown::new(notify_shutdown.subscribe()),
        shutdown_complete_tx.clone(),
    );
    
    tokio::spawn(http_server);
    
    println!("server running at {myurl}");
    
    if !nobrowse {
        webbrowser::open(&myurl).ok();
    }

    match signal::ctrl_c().await {
        Ok(()) => {
            println!("Got ctrl-c, exiting!");
            drop(notify_shutdown);
            drop(shutdown_complete_tx);
            drop(tx);
        }
        Err(err) => {
            eprintln!("Unable to listen for shutdown signal: {}", err);
        },
    };

    let _ = shutdown_complete_rx.recv().await;
    Ok(())
}
