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
        // None => {
        //     start_server(String::from("."));
        // }
        Some(Commands::Start{ app_dir }) => {
            start_server(app_dir.as_ref().unwrap().to_string());
        }
        Some(x) => panic!("{:?} not supported", x),
        None => panic!("must have command")
    }
}
