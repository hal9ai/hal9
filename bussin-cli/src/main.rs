use clap::{Parser, Subcommand};
use serde::Deserialize;
use std::path::Path;

#[derive(Deserialize, Debug)]
struct Config {
    name: String,
    runtimes: Runtimes,
}

#[derive(Deserialize, Debug)]
struct Runtimes {
    r: Option<String>,
    python: Option<String>,
}

fn read_config(path: &Path) -> std::io::Result<Config> {
    let content = std::fs::read_to_string(path)?;
    let parsed = Ok(toml::from_str(&content)?);
    parsed
}

#[derive(Parser)]
struct Cli {
    #[clap(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    Start { app_dir: Option<String> },
}

fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Start { app_dir }) => {
            let config_path = match app_dir {
                Some(app_dir) => Path::new(app_dir),
                None => Path::new("."),
            };
            let config = read_config(&config_path.join("bussin.toml")).unwrap();
        }
        None => {}
    }
}
