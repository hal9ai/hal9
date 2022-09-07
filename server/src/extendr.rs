#![allow(clippy::not_unsafe_ptr_arg_deref)]

use crate::server::start_server;
use extendr_api::prelude::*;

/// Start server.
/// @export
#[extendr]
fn h9_start2(#[default = "."] path: String) -> u32 {
    // #[allow(clippy::not_unsafe_ptr_arg_deref)]
    start_server(path, 0).ok();
    0
}

// Macro to generate exports.
// This ensures exported functions are registered with R.
// See corresponding C code in `entrypoint.c`.
extendr_module! {
    mod hal9;
    fn h9_start2;
}
