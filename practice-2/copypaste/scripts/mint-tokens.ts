import { getExplorerLink, getKeypairFromEnvironment } from '@solana-developers/helpers';
import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import 'dotenv/config';

const user = getKeypairFromEnvironment('SOLANA_KEYPAIR');
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

const mint = new PublicKey('Dbt9EAkXJx4oHKaV4MN96W2rrAa17xqK9SUUX67CpNjz');
const recipient = new PublicKey('8RyHsUrpwJWKZvSCBUgZwSZ9yruNWeN1StjjmzhGtqkT');

const recipientAssociatedTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  mint,
  recipient,
  undefined,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID
);
const amount = LAMPORTS_PER_SOL;

const transactionSignature = await mintTo(
  connection,
  user,
  mint,
  recipientAssociatedTokenAccount.address,
  user,
  amount,
  undefined,
  undefined,
  TOKEN_2022_PROGRAM_ID
);

const link = getExplorerLink("transaction", transactionSignature, "devnet");

console.log(`✅ Success! Mint Token Transaction: ${link}`);