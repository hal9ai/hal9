use serde::Deserialize;
use std::fs;
use std::path::PathBuf;

// TODO: revisit dead code

#[allow(dead_code)]
#[derive(Deserialize, Debug, Clone)]
pub(crate) struct Config {
    pub application: Application,
    pub client: Client,
    pub runtimes: Vec<Runtime>,
}

#[allow(dead_code)]
#[derive(Deserialize, Debug, Clone)]
pub(crate) struct Application {
    pub name: String,
    pub version: String,
}

#[derive(Deserialize, Debug, Clone)]
pub(crate) struct Client {
    pub design: String,
}

#[derive(Deserialize, Debug, Clone)]
pub(crate) enum Platform {
    R,
    Python,
}

#[allow(dead_code)]
#[derive(Deserialize, Debug, Clone)]
pub(crate) struct Runtime {
    pub name: String,
    pub platform: Platform,
    pub script: String,
    pub path: Option<String>,
}

impl Config {
    pub(crate) fn parse(path: PathBuf) -> Self {
        let contents = fs::read_to_string(path).unwrap();
        toml::from_str(&contents).unwrap()
    }
}
