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

struct AppState {
    app_dir: String,
    designer_string: String,
    tx_handler: tokio::sync::mpsc::Sender<RtControllerMsg>, 
    rx_uri_handler: crossbeam_channel::Receiver<Url>,
    last_heartbeat: web::Data<AtomicUsize>,
}

async fn run(data: web::Data<AppState>) -> impl Responder {
    let contents = data.designer_string
        .replace("__options__", r#"{"mode": "run"}"#);
    HttpResponse::Ok().body(contents)
}

async fn design(data: web::Data<AppState>) -> impl Responder {
    let contents = data.designer_string
        .replace("__options__", r#"{"mode": "design"}"#);
    HttpResponse::Ok().body(contents)
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

async fn eval(
    data: web::Data<AppState>,
    req: web::Json<Manifests>,
) -> impl Responder {
    let rt = req.manifests[0].runtime.clone();
    let runtime = rt.clone();
    let tx_handler = &data.tx_handler;
    tx_handler.send(RtControllerMsg::GetUri(rt)).await.ok();
    let rx_uri_handler = &data.rx_uri_handler;
    let uri = rx_uri_handler.recv().unwrap().join("eval").unwrap();
    let manifest = req.manifests[0].calls.clone();

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
    
    res.runtime = Some(runtime);

    let res = ManifestResponse {
        responses: vec![res] 
    };

    let response = serde_json::to_string(&res).unwrap();

    HttpResponse::Ok().body(response)
}

async fn pipeline(data: web::Data<AppState>) -> Result<NamedFile> {
    let design_path = PathBuf::new().join(&data.app_dir).join("app.json");
    Ok(NamedFile::open(design_path)?)
}

async fn pipeline_post(data: web::Data<AppState>, req: String) -> impl Responder {
    let design_path = Path::new(&data.app_dir).join("app.json");
    let mut output = std::fs::File::create(design_path).unwrap();
    write!(output, "{}", req).ok();
    HttpResponse::Ok().body("{}")
}

#[tokio::main]
pub async fn start_server(app_path: String, port: u16) -> std::io::Result<()> {


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

    RuntimesController::new(conf.runtimes.clone(), app_path_for_controller, rx, tx_uri, Shutdown::new(notify_shutdown.subscribe()), shutdown_complete_tx.clone()).monitor().ok();


    tx.send(RtControllerMsg::StartAll).await.ok();

    let tx_fs = tx.clone();


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
                    app_dir: app_path_data.clone(),
                    designer_string: designer_string.clone(),
                    tx_handler: tx_handler.clone(),
                    rx_uri_handler: rx_uri_handler.clone(),
                    last_heartbeat: last_heartbeat.clone()
                }
            ))
            .route("/pipeline", web::get().to(pipeline))
            .route("/pipeline", web::post().to(pipeline_post))
            .route("/design", web::get().to(design))
            .route("/", web::get().to(run))
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

    monitor_heartbeat(http_server_handle, last_heartbeat_arc, 60 * 5, tx_heartbeat,
        Shutdown::new(notify_shutdown.subscribe()),
        shutdown_complete_tx.clone(),
    );

    tokio::spawn(http_server);

    println!("server running at {myurl}");

    webbrowser::open(&myurl).ok();

    match signal::ctrl_c().await {
        Ok(()) => {
            println!("got ctrl-c, exiting!");
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
