#![allow(clippy::not_unsafe_ptr_arg_deref)]

use crate::server::start_server;
use extendr_api::prelude::*;
use extendr_api::wrapper::nullable::Nullable;

/// Start server.
/// @export
#[extendr]
fn h9_start2(#[default = "."] path: String, #[default = "NULL"] port: Nullable<i32>, #[default = "600"] timeout: u32) {
    let port: u16 = match port {
        Nullable::Null => 0,
        Nullable::NotNull(x) => x
    }
    .try_into()
    .unwrap();

    start_server(path, port, timeout).ok();
}

// Macro to generate exports.
// This ensures exported functions are registered with R.
// See corresponding C code in `entrypoint.c`.
extendr_module! {
    mod hal9;
    fn h9_start2;
}
