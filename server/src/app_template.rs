use std::fs;
use std::path::Path;
use std::fs::File;
use std::io::Write;
use crate::config::Platform;

struct AppTemplateSpec<'a> {
    config_toml: &'a [u8],
    design_json: &'a [u8],
    backend_script: &'a [u8],
    backend_script_dir: &'a str,
    backend_script_name: &'a str,
}

pub fn new_app(directory: String, platform: Platform) -> Result<(), std::io::Error> {

    let spec = match platform {
        Platform::R => AppTemplateSpec {
            config_toml: include_bytes!("../resources/demo_app_r/hal9.toml"),
            design_json: include_bytes!("../resources/demo_app_r/app.json"),
            backend_script: include_bytes!("../resources/demo_app_r/R/backend.R"),
            backend_script_dir: "R",
            backend_script_name: "backend.R",
        },
        Platform::Python => AppTemplateSpec { 
            config_toml: include_bytes!("../resources/demo_app_py/hal9.toml"),
            design_json: include_bytes!("../resources/demo_app_py/app.json"),
            backend_script: include_bytes!("../resources/demo_app_py/python/backend.py"),
            backend_script_dir: "python", 
            backend_script_name: "backend.py",
        }
    };

    let app_root: &Path = Path::new(&directory);

    fs::create_dir_all(app_root)?;
    fs::create_dir(app_root.join(spec.backend_script_dir))?;

    let mut file_app_config_toml = File::create(app_root.join("hal9.toml"))?;
    file_app_config_toml.write_all(spec.config_toml)?;

    let mut file_app_design_json = File::create(app_root.join("app.json"))?;
    file_app_design_json.write_all(spec.design_json)?;

    let mut file_app_backend_script = File::create(
        app_root
            .join(spec.backend_script_dir)
            .join(spec.backend_script_name)
        )?;
    file_app_backend_script.write_all(spec.backend_script)?;

    let app_root_string = app_root.to_string_lossy();

    println!("New app with {platform} runtime created at `{app_root_string}`.");

    Ok(())
}