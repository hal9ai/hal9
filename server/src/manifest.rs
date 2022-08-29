use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug, Clone)]
pub struct Manifests {
    pub manifests: Vec<Manifest>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Manifest {
    pub runtime: String,
    pub nodes: Vec<Node>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Node {
    pub name: String,
    pub calls: Option<Vec<Call>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Call {
    pub fn_name: String,
    pub args: Option<Vec<Arg>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Arg {
    pub arg_name: String,
    pub arg_value: String,
}

impl Manifest {}
