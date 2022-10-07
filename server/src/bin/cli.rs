use clap::{Parser, Subcommand};
use hal9::server::start_server;
use hal9::app_template::new_app;
use hal9::config::Platform;
use std::str::FromStr;

#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Cli {
    #[clap(subcommand)]
    command: Option<Commands>,

    #[clap(short, long, value_parser, default_value = "0")]
    port: u16,

    #[clap(short, long, value_parser, default_value = "600")]
    timeout: u32,

    #[clap(short, long, value_parser)]
    nobrowse: bool,

    #[clap(short, long, default_value = "R")]
    platform: String,
}

#[derive(Subcommand, Debug)]
enum Commands {
    Start { app_dir: Option<String> },
    New { dir: String }
}

fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Start{ app_dir }) => {
            start_server(app_dir.as_ref().unwrap().to_string(), 
            cli.port, cli.timeout, cli.nobrowse).ok();
        },
        Some(Commands::New { dir }) => {
            let platform = Platform::from_str(&cli.platform).unwrap();
            new_app(dir.to_string(), platform).ok();
        }
        None => println!("Missing subcommand! Seek help.")
    }
}
