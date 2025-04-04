use solana_client::rpc_client::RpcClient;
use solana_sdk::commitment_config::CommitmentConfig;
use solana_sdk::pubkey::Pubkey;
use solana_sdk::signer::keypair::Keypair;
use solana_sdk::signer::Signer;
use std::fs::File;
use std::io::{Read, Write};
use std::path::Path;
use dotenv::dotenv;
use std::env;
use std::thread;
use std::time::Duration;

pub const DEFAULT_RPC_URL: &str = "https://api.devnet.solana.com";
pub const ENV_KEYPAIR_KEY: &str = "SOLANA_KEYPAIR";

pub fn generate_keypair(save_to_env: bool) -> Result<Keypair, Box<dyn std::error::Error>> {
    let keypair = Keypair::new();
    println!("Public Key: {}", keypair.pubkey());

    if save_to_env {
        save_keypair_to_env(&keypair)?;
    }

    Ok(keypair)
}

pub fn check_balance(pubkey: &str) -> Result<f64, Box<dyn std::error::Error>> {
    let rpc_client =
        RpcClient::new_with_commitment(DEFAULT_RPC_URL.to_string(), CommitmentConfig::confirmed());

    let pubkey = pubkey.parse().map_err(|_| "Invalid public key format")?;

    let balance = rpc_client.get_balance(&pubkey)?;
    let balance_in_sol = balance as f64 / 1_000_000_000.0;

    println!("Balance: {} SOL ({} lamports)", balance_in_sol, balance);
    Ok(balance_in_sol)
}

pub async fn request_airdrop(
    pubkey: &str,
    amount_sol: f64,
) -> Result<(), Box<dyn std::error::Error>> {
    let rpc_client =
        RpcClient::new_with_commitment(DEFAULT_RPC_URL.to_string(), CommitmentConfig::confirmed());

    let pubkey = pubkey.parse::<Pubkey>()?;
    let lamports = (amount_sol * 1_000_000_000.0) as u64;

    println!("Requesting airdrop of {} SOL to {}", amount_sol, pubkey);

    match rpc_client.request_airdrop(&pubkey, lamports) {
        Ok(signature) => {
            println!("Airdrop request successful!");
            println!("Transaction signature: {}", signature);

            match rpc_client.confirm_transaction(&signature) {
                Ok(_) => {
                    println!("Airdrop confirmed!");
                    thread::sleep(Duration::from_secs(1));
                    
                    let new_balance = rpc_client.get_balance(&pubkey)?;
                    let balance_in_sol = new_balance as f64 / 1_000_000_000.0;
                    if balance_in_sol >= amount_sol {
                        println!("New balance: {} SOL", balance_in_sol);
                        return Ok(());
                    }

                    println!("Warning: Balance update may be delayed. Please check balance separately.");
                }
                Err(e) => println!("Warning: Could not confirm transaction: {}", e),
            }
            Ok(())
        }
        Err(e) => Err(format!("Airdrop failed: {}", e).into()),
    }
}

pub fn save_keypair_to_env(keypair: &Keypair) -> Result<(), Box<dyn std::error::Error>> {
    let encoded = bs58::encode(keypair.to_bytes()).into_string();
    
    let env_path = ".env";
    let env_content = if Path::new(env_path).exists() {
        let mut content = String::new();
        File::open(env_path)?.read_to_string(&mut content)?;
        
        let lines: Vec<&str> = content.lines()
            .filter(|line| !line.starts_with("SOLANA_KEYPAIR="))
            .collect();
        lines.join("\n") + "\n"
    } else {
        String::new()
    };

    let mut file = File::create(env_path)?;
    file.write_all(env_content.as_bytes())?;
    writeln!(file, "{}={}", ENV_KEYPAIR_KEY, encoded)?;
    
    println!("Keypair saved to .env file with public key: {}", keypair.pubkey());
    Ok(())
}

pub fn load_keypair_from_env() -> Result<Keypair, Box<dyn std::error::Error>> {
    dotenv().ok();
    
    let encoded = env::var(ENV_KEYPAIR_KEY)
        .map_err(|_| format!("{} not found in .env file", ENV_KEYPAIR_KEY))?;
    
    let decoded = bs58::decode(encoded.trim())
        .into_vec()
        .map_err(|_| "Failed to decode base58 string")?;
    
    let keypair = Keypair::from_bytes(&decoded)
        .map_err(|_| "Failed to create keypair from bytes")?;
    
    println!("Loaded keypair from .env with public key: {}", keypair.pubkey());
    Ok(keypair)
}
