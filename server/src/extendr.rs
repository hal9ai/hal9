#![allow(clippy::not_unsafe_ptr_arg_deref)]

use crate::server::start_server;
use extendr_api::prelude::*;

/// Start server.
/// @export
#[extendr]
fn h9_start2(#[default = "."] path: String, #[default = "NA_integer_"] port: Option<i32>) {
    // #[allow(clippy::not_unsafe_ptr_arg_deref)]
    let port: u16 = port.unwrap_or(0).try_into().unwrap();
    start_server(path, port).ok();
}

// Macro to generate exports.
// This ensures exported functions are registered with R.
// See corresponding C code in `entrypoint.c`.
extendr_module! {
    mod hal9;
    fn h9_start2;
}
