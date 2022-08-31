use crate::server::start_server;
use extendr_api::prelude::*;

/// Return string `"Hello world!"` to R.
/// @export
#[extendr]
fn hello_world() -> &'static str {
    "Hello world!"
}

/// Start server.
/// @export
#[extendr]
fn h9_start2() -> u32 {
    start_server();
    0
}

// Macro to generate exports.
// This ensures exported functions are registered with R.
// See corresponding C code in `entrypoint.c`.
extendr_module! {
    mod hal9;
    fn hello_world;
    fn h9_start2;
}
