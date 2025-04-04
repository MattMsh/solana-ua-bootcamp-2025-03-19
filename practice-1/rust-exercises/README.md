# Solana Rust Exercises

This project contains Rust exercises for working with the Solana blockchain, specifically focused on basic operations like keypair management, balance checking, and requesting airdrops on the Devnet.

## Prerequisites

- Rust and Cargo (latest stable version)
- Solana CLI tools

## Setup

1. Clone the repository
2. Navigate to the project directory:

```bash
cd practice-1/rust-exercises
```

3. Build the project:

```bash
cargo build
```

## Features

- Generate and manage Solana keypairs
- Store keypairs securely in `.env` file
- Check account balances
- Request airdrops from Devnet

## Usage

### Generate a New Keypair

Generate a new keypair and save it to `.env` file:

```bash
cargo run generate-keypair
```

### Load Existing Keypair

Load a keypair from `.env` file:

```bash
cargo run load-keypair
```

### Check Balance

Check the balance of a public key:

```bash
cargo run check-balance <PUBKEY>
```

### Request Airdrop

Request an airdrop of SOL from Devnet (maximum 2 SOL):

```bash
cargo run airdrop <PUBKEY> <AMOUNT>
```

## Environment Variables

The project uses a `.env` file to store the keypair. The following environment variable is used:

- `SOLANA_KEYPAIR`: Base58 encoded keypair string

## Security Notes

- Never share your `.env` file or private key
- Always add `.env` to your `.gitignore`
- This project is for educational purposes and Devnet usage only

## Dependencies

- solana-client = "2.2.6"
- solana-sdk = "2.2.2"
- tokio = "1.44.1"
- bs58 = "0.5.0"
- dotenv = "0.15.0"
