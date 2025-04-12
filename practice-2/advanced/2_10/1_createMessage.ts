import 'dotenv/config';
import {
  getKeypairFromEnvironment,
  getKeypairFromFile,
} from '@solana-developers/helpers';
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Message,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const payer = getKeypairFromEnvironment('PAYER_KEYPAIR');

const receiver = await getKeypairFromFile(
  './2JzMfCQWe9vTwXZcdEVv8zrwFJZTo56cd6yKHBJVzrwE.json'
);

const mint = getKeypairFromEnvironment('MINT_WALLET').publicKey;

const payerAssociatedTokenAddress = await getAssociatedTokenAddress(
  mint,
  payer.publicKey
);

const receiverAssociatedTokenAddress = await getAssociatedTokenAddress(
  mint,
  receiver.publicKey
);

const transferTokens = createTransferInstruction(
  payerAssociatedTokenAddress,
  receiverAssociatedTokenAddress,
  payer.publicKey,
  LAMPORTS_PER_SOL * 1
);

const tx = new Transaction();

tx.add(transferTokens);
tx.feePayer = receiver.publicKey;
tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
tx.partialSign(payer);

const serializedMessage = tx
  .serialize({ requireAllSignatures: false })
  .toString('base64');

console.dir(serializedMessage);
