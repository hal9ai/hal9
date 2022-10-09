use pyo3::prelude::*;
use crate::app_template::new_app;
use crate::server::start_server;

#[pyfunction(path = "\".\"", port = "0", timeout = "600", nobrowse = "false")]
fn start(path: &str, port: u16, timeout: u32, nobrowse: bool){
    start_server(path.to_string(), port, timeout, nobrowse).ok();
}
#[pyfunction(path = "\".\"")]
fn new(path: &str) {
    new_app(path.to_string(), crate::config::Platform::Python).ok();
}
#[pymodule]
#[pyo3(name = "_hal9")]
fn _hal9(_py: Python<'_>, m: &PyModule) -> PyResult<()> {
    m.add_function(wrap_pyfunction!(start, m)?)?;
    m.add_function(wrap_pyfunction!(new, m)?)?;
    Ok(())
}
