use clap::{Parser, Subcommand};
use hal9::server::start_server;

#[derive(Parser)]
struct Cli {
    #[clap(subcommand)]
    command: Option<Commands>,

    #[clap(short, long, value_parser, default_value = "0")]
    port: u16,
}

#[derive(Subcommand, Debug)]
enum Commands {
    Start { app_dir: Option<String> },
}

fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Start{ app_dir }) => {
            start_server(app_dir.as_ref().unwrap().to_string(), cli.port).ok();
        },
        None => println!("Missing subcommand! Seek help.")
    }
}
