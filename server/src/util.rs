use notify::{watcher, DebouncedEvent, RecursiveMode, Watcher};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::mpsc::channel;
use std::sync::mpsc::Sender;
use std::sync::Arc;
use std::time::Duration;
use std::time::SystemTime;

use crate::runtimes::RtControllerMsg;

pub fn monitor_heartbeat(
    handle: actix_web::dev::ServerHandle,
    last_heartbeat_ref: Arc<AtomicUsize>,
    timeout_secs: u32,
    runtime_controller_tx: Sender<RtControllerMsg>,
) {
    tokio::spawn(async move {
        let mut interval = tokio::time::interval(tokio::time::Duration::from_millis(1000));
        loop {
            interval.tick().await;
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
                    .unwrap();
                handle.stop(true).await;
            }
        }
    });
}

pub async fn monitor_fs_changes(
    dir: String,
    interval_ms: u64,
    runtime_controller_tx: Sender<RtControllerMsg>,
) -> tokio::task::JoinHandle<()> {
    tokio::spawn(async move {
        let (tx, rx) = channel();
        let mut watcher = watcher(tx, Duration::from_millis(interval_ms)).unwrap();

        watcher.watch(dir, RecursiveMode::Recursive).unwrap();

        loop {
            let msg = rx.recv();
            match msg {
                Ok(event) => match event {
                    DebouncedEvent::Write(_) => {
                        println!("write event detected, restarting runtimes");
                        runtime_controller_tx
                            .send(RtControllerMsg::RestartAll)
                            .unwrap();
                    }
                    _ => println!("{:?}", event),
                },

                Err(e) => println!("watch error: {:?}", e),
            }
        }
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
