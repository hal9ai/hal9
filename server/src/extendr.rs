#![allow(clippy::not_unsafe_ptr_arg_deref)]

#[cfg(feature = "extendr")]
use crate::app_template::new_app;
#[cfg(feature = "extendr")]
use crate::server::start_server;
#[cfg(feature = "extendr")]
use crate::config::Platform;

#[cfg(feature = "extendr")]
use extendr_api::prelude::*;
#[cfg(feature = "extendr")]
use extendr_api::wrapper::nullable::Nullable;

/// Start server.
/// @export
#[cfg(feature = "extendr")]
#[extendr]
fn h9_start(#[default = "."] path: String, #[default = "NULL"] port: Nullable<i32>, #[default = "600"] timeout: u32,
            #[default = "FALSE"] nobrowse: bool) {
    let port: u16 = match port {
        Nullable::Null => 0,
        Nullable::NotNull(x) => x
    }
    .try_into()
    .unwrap();

    start_server(path, port, timeout, nobrowse).ok();
}

/// Create a new demo app.
/// @export
#[cfg(feature = "extendr")]
#[extendr]
fn h9_new(path: String) {
    new_app(path, Platform::R).ok();
}

// Macro to generate exports.
// This ensures exported functions are registered with R.
// See corresponding C code in `entrypoint.c`.
#[cfg(feature = "extendr")]
extendr_module! {
    mod hal9;
    fn h9_start;
    fn h9_new;
}
