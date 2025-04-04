use rust::{check_balance, generate_keypair, load_keypair_from_env, request_airdrop};
use std::env;

fn print_usage() {
    println!("Usage:");
    println!("  cargo run generate-keypair        - Generate a new keypair and save to .env file");
    println!("  cargo run load-keypair            - Load keypair from .env file");
    println!("  cargo run check-balance <pubkey>  - Check balance of a public key");
    println!("  cargo run airdrop <pubkey> <amount> - Request SOL airdrop from devnet (max 2 SOL)");
}

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        print_usage();
        return;
    }

    match args[1].as_str() {
        "generate-keypair" => match generate_keypair(true) {
            Ok(_) => println!("Keypair generated successfully!"),
            Err(e) => eprintln!("Error generating keypair: {}", e),
        },
        "load-keypair" => {
            match load_keypair_from_env() {
                Ok(_) => println!("Keypair loaded successfully from .env file!"),
                Err(e) => eprintln!("Error loading keypair: {}", e),
            }
        }
        "check-balance" => {
            if args.len() < 3 {
                println!("Please provide a public key");
                print_usage();
                return;
            }
            match check_balance(&args[2]) {
                Ok(_) => (),
                Err(e) => eprintln!("Error checking balance: {}", e),
            }
        }
        "airdrop" => {
            if args.len() < 4 {
                println!("Please provide a public key and amount");
                print_usage();
                return;
            }
            let amount = match args[3].parse::<f64>() {
                Ok(val) if val <= 2.0 => val,
                Ok(_) => {
                    println!("Amount cannot exceed 2 SOL on devnet");
                    return;
                }
                Err(_) => {
                    println!("Invalid amount specified");
                    return;
                }
            };
            match request_airdrop(&args[2], amount).await {
                Ok(_) => (),
                Err(e) => eprintln!("Error requesting airdrop: {}", e),
            }
        }
        _ => {
            println!("Unknown command: {}", args[1]);
            print_usage();
        }
    }
}
