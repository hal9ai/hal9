use crate::config::Config;
use crate::manifest::*;
use crate::runtimes::{RtControllerMsg, RuntimesController};
use crate::util::{monitor_fs_changes, monitor_heartbeat, time_now};
use actix_files::NamedFile;
use actix_web::{get, web, HttpResponse, Responder, Result};
use crossbeam::channel as crossbeam_channel;
use crossbeam::channel::bounded;
use reqwest;
use serde_json;
use std::fs;
use std::path::Path;
use std::path::PathBuf;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::mpsc::channel;
use std::sync::Arc;
use url::Url;

async fn run(designer_string: web::Data<String>) -> impl Responder {
    // let contents = fs::read_to_string("resources/client.html")
    //     .unwrap()
    //     .replace("__options__", r#"{"mode": "run"}"#);

    let contents = designer_string
        // .unwrap()
        .replace("__options__", r#"{"mode": "run"}"#);
    HttpResponse::Ok().body(contents)
}

async fn design(designer_string: web::Data<String>) -> impl Responder {
    // let contents = fs::read_to_string("resources/client.html")
    //     .unwrap()
    //     .replace("__options__", r#"{"mode": "design"}"#);

    let contents = designer_string
        .replace("__options__", r#"{"mode": "design"}"#);
    HttpResponse::Ok().body(contents)
}

async fn ping(last_heartbeat: web::Data<AtomicUsize>) -> impl Responder {
    last_heartbeat
        .fetch_update(Ordering::SeqCst, Ordering::SeqCst, |_| {
            Some(time_now().try_into().unwrap())
        })
        .ok();

    let timestamp = last_heartbeat.load(Ordering::Relaxed);

    HttpResponse::Ok().body(timestamp.to_string())
}

async fn eval(
    tx_hander: web::Data<std::sync::mpsc::Sender<RtControllerMsg>>,
    rx_uri_handler: web::Data<crossbeam_channel::Receiver<Url>>,
    req: web::Json<Manifests>,
) -> impl Responder {
    println!("{req:?}");
    let rt = req.manifests[0].runtime.clone();
    tx_hander.send(RtControllerMsg::GetUri(rt)).unwrap();
    let uri = rx_uri_handler.recv().unwrap();
    let manifest = req.manifests[0].nodes.clone();

    // let client = reqwest::Client::new();
    // let scheme = uri.scheme_str().unwrap();
    // let authority = uri.authority().unwrap().as_str();
    // let path_and_query = uri.path_and_query().unwrap().as_str();
    // let uri_str = format!("{scheme}://{authority}{path_and_query}");

    // let params = serde_json::to_string(&manifest).unwrap();

    // println!("{:?}", params);

    // TODO: impl `Response`

    // let res = client
    //     .post(uri_str)
    //     .json(&params)
    //     .send()
    //     .await
    //     .unwrap()
    //     .json::<Response>()
    //     .await
    //     .unwrap();

    HttpResponse::Ok().body("")
}

async fn pipeline() -> Result<NamedFile> {
    let path: PathBuf = ("app_data/pipeline.json").parse().unwrap();
    Ok(NamedFile::open(path)?)
}

// #[actix_web::main]
#[tokio::main]
pub async fn start_server(app_path: String, port: u16) -> std::io::Result<()> {
    use actix_web::{web, App, HttpServer};

    let app_path_to_monitor = app_path.clone();
    let app_path_for_controller = app_path.clone();
    let config_path = PathBuf::new().join(app_path).join("hal9.toml");
    let conf = Config::parse(config_path);

    let (tx, rx) = channel();
    let (tx_uri, rx_uri) = bounded(0);
    let rx_uri_handler = rx_uri.clone();

    let runtimes_controller = RuntimesController::new(conf.runtimes.clone(), app_path_for_controller, rx, tx_uri);

    runtimes_controller.monitor().unwrap();

    tx.send(RtControllerMsg::StartAll).unwrap();
    tx.send(RtControllerMsg::GetUri(String::from("r"))).unwrap();

    let tx_fs = tx.clone();

    monitor_fs_changes(app_path_to_monitor, 1000, tx_fs).await;

    let last_heartbeat = web::Data::new(AtomicUsize::new(time_now().try_into().unwrap()));
    let last_heartbeat_clone = Arc::clone(&last_heartbeat);


    let designer_bytes = include_bytes!("../resources/client.html");
    let designer_string: String = String::from_utf8_lossy(designer_bytes).to_string();

    let tx_handler = tx.clone();
    let http_server = HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(designer_string.clone()))
            .app_data(web::Data::new(tx_handler.clone()))
            .app_data(web::Data::new(rx_uri_handler.clone()))
            .app_data(web::Data::new(last_heartbeat.clone()))
            .route("/pipeline", web::get().to(pipeline))
            .route("/design", web::get().to(design))
            .route("/", web::get().to(run))
            .service(web::resource("/ping").to(ping))
            .service(web::resource("/eval").route(web::post().to(eval)))
    })
    .disable_signals()
    .bind(("127.0.0.1", port))
    .unwrap();

    let myport = http_server.addrs().pop().unwrap().port();
    let http_server = http_server.run();

    println!("server listening on port {myport}");

    let http_server_handle = http_server.handle();

    let tx_heartbeat = tx.clone();
    monitor_heartbeat(http_server_handle, last_heartbeat_clone, 60, tx_heartbeat);

    tokio::spawn(http_server).await?
}
