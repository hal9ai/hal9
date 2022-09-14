use serde::{Deserialize, Serialize};

#[derive(Deserialize, Debug, Clone)]
pub(crate) struct Manifests {
    pub manifests: Vec<Manifest>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Manifest {
    pub runtime: String,
    pub calls: Vec<Call>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Call {
    pub node: String,
    pub fn_name: String,
    pub args: Option<Vec<Arg>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct Arg {
    pub name: String,
    pub value: Option<serde_json::Value>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct ManifestResponse {
    pub responses: Vec<RuntimeResponse>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct RuntimeResponse {
    pub calls: Vec<CallResponse>,
    pub runtime: Option<String>
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub(crate) struct CallResponse {
    pub node: String,
    pub fn_name: String,
    pub result: Option<serde_json::Value>,
}