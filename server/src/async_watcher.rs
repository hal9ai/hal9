// adopted from notify-rs/notify

use futures::{
    channel::mpsc::{channel, Receiver},
    SinkExt,
};
use notify::{Event, RecommendedWatcher, recommended_watcher};

pub(crate) fn async_watcher() -> notify::Result<(RecommendedWatcher, Receiver<notify::Result<Event>>)> {
    let (mut tx, rx) = channel(1);

    // Automatically select the best implementation for your platform.
    // You can also access each implementation directly e.g. INotifyWatcher.
    // let watcher = RecommendedWatcher::new(move |res| {
    let watcher = recommended_watcher(move |res| {
        futures::executor::block_on(async {
            tx.send(res).await.unwrap();
        })
    })?;

    Ok((watcher, rx))
}