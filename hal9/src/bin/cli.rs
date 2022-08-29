use clap::{Parser, Subcommand};
use hal9::server::start_server;

#[derive(Parser)]
struct Cli {
    #[clap(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand, Debug)]
enum Commands {
    Start { app_dir: Option<String> },
}

fn main() {
    let cli = Cli::parse();

    match &cli.command {
        None => {
            start_server();
        }
        Some(x) => panic!("{:?} not supported", x),
    }
}
