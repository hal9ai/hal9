use std::fs;
use std::path::Path;
use std::fs::File;
use std::io::Write;

pub fn new_app(directory: String) -> Result<(), std::io::Error> {
    let app_config_toml = include_bytes!("../resources/demo_app/hal9.toml");
    let app_design_json = include_bytes!("../resources/demo_app/app.json");
    let app_backend_script = include_bytes!("../resources/demo_app/R/backend.R");
    
    let app_root: &Path = Path::new(&directory);

    fs::create_dir_all(app_root)?;
    fs::create_dir(app_root.join("R"))?;

    let mut file_app_config_toml = File::create(app_root.join("hal9.toml"))?;
    file_app_config_toml.write_all(app_config_toml)?;

    let mut file_app_design_json = File::create(app_root.join("app.json"))?;
    file_app_design_json.write_all(app_design_json)?;

    let mut file_app_backend_script = File::create(app_root.join("R/backend.R"))?;
    file_app_backend_script.write_all(app_backend_script)?;

    let app_root_string = app_root.to_string_lossy();

    println!("New app created at `{app_root_string}`.");

    Ok(())
}