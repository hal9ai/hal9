use std::sync::atomic::{AtomicUsize, Ordering};
use tokio::sync::mpsc::Sender;
use std::sync::Arc;
use std::time::SystemTime;
use crate::shutdown::Shutdown;
use tokio::sync::mpsc;
use crate::async_watcher::async_watcher;
use crate::runtimes::RtControllerMsg;
use notify::{RecursiveMode, Watcher};
use notify::event::EventKind;
use futures::StreamExt;

pub(crate) fn monitor_heartbeat(
    handle: actix_web::dev::ServerHandle,
    last_heartbeat_ref: Arc<AtomicUsize>,
    timeout_secs: u32,
    runtime_controller_tx: Sender<RtControllerMsg>,
    mut shutdown: Shutdown,
    _shutdown_complete_tx: mpsc::Sender<()>,
) -> Option<tokio::task::JoinHandle<()>> {

    if timeout_secs == 0 {
        return None
    }

    let handle = tokio::spawn(async move {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_millis(1000));
        while !shutdown.is_shutdown() {
            tokio::select! {
                _ = interval.tick() => {
                    let last_heartbeat: u32 = last_heartbeat_ref
                    .load(Ordering::SeqCst)
                    .try_into()
                    .unwrap();
                    let diff: u32 = time_now() - last_heartbeat;
                    if diff > timeout_secs {
                        println!(
                            "no heartbeat from client for {}s, shutting down",
                            timeout_secs
                        );
                        runtime_controller_tx
                        .send(RtControllerMsg::StopAll)
                        .await.ok();
                        handle.stop(true).await;
                        break;
                    } 
                }
                _ = shutdown.recv() => {
                    println!("heartbeat monitor shutting down");
                }
            }
        }
        
    });
    Some(handle)
}

#[allow(clippy::collapsible_match)]
pub(crate) fn monitor_fs_changes(
    dir: String,
    runtime_controller_tx: Sender<RtControllerMsg>,
    mut shutdown: Shutdown,
    _shutdown_complete_tx: mpsc::Sender<()>,
) -> tokio::task::JoinHandle<Result<(), notify::Error>> {
    
    tokio::spawn( async move {
        let (mut watcher, mut rx) = async_watcher()?;
        
        watcher.watch(dir.as_ref(), RecursiveMode::Recursive)?;
        while !shutdown.is_shutdown() {
            tokio::select! {
                msg = rx.next() => {
                    if let Some(Ok(event)) = msg {
                        if let EventKind::Modify(kind) = event.kind {
                            match kind {
                                notify::event::ModifyKind::Data(_x) => {
                                    let paths = event.paths;
                                    println!("detected data modification in {paths:?}");
                                    runtime_controller_tx.send(RtControllerMsg::RestartAll).await.ok();
                                }
                                _ => {}
                            } 
                        }
                    }
                }
                _ =  shutdown.recv() => {
                }
            }
        }
        
        notify::Result::Ok(())
    })
}


pub fn time_now() -> u32 {
    SystemTime::now()
    .duration_since(SystemTime::UNIX_EPOCH)
    .unwrap()
    .as_secs()
    .try_into()
    .unwrap()
}
