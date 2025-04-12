import 'dotenv/config';
import { getKeypairFromEnvironment } from '@solana-developers/helpers';
import { createMemoInstruction } from '@solana/spl-memo';

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';

async function main() {
  // Get the sender's keypair from environment
  const sender = getKeypairFromEnvironment('SOLANA_KEYPAIR');
  console.log(`Sender address: ${sender.publicKey.toBase58()}`);

  // Create connection to devnet
  const connection = new Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  );

  // Get the recipient's public key from command line arguments
  const recipientPubkey = new PublicKey(process.argv[2]);
  console.log(`Recipient address: ${recipientPubkey.toBase58()}`);

  // Get the amount to send from command line arguments
  const amount = parseFloat(process.argv[3]);
  if (isNaN(amount) || amount <= 0) {
    console.error('Please provide a valid amount in SOL');
    process.exit(1);
  }

  // Convert SOL to lamports
  const lamports = amount * LAMPORTS_PER_SOL;

  const memoIx = createMemoInstruction('Send with Memo!');

  // Create a transaction
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: recipientPubkey,
      lamports,
    })
  );

  transaction.add(memoIx);

  // Send the transaction
  try {
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      sender,
    ]);
    console.log(`Transaction sent and confirmed! Signature: ${signature}`);
  } catch (error) {
    console.error('Error sending transaction:', error);
  }
}

main().catch(console.error);
