use serde::Deserialize;
use std::{fmt, fs};
use std::path::PathBuf;
use std::str::FromStr;


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
pub enum Platform {
    R,
    Python,
}

impl fmt::Display for Platform {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Platform::R => write!(f, "R"),
            Platform::Python => write!(f, "Python"),
        }
    }
}

impl FromStr for Platform {
    type Err = ();

    fn from_str(input: &str) -> Result<Platform, Self::Err> {
        match input.to_lowercase().as_str() {
            "r" => Ok(Platform::R),
            "python" => Ok(Platform::Python),
            _ => Err(())
        }
    }
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
