import 'dotenv/config';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
import {
  getKeypairFromEnvironment,
  getKeypairFromFile,
} from '@solana-developers/helpers';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const payer = getKeypairFromEnvironment('PAYER_KEYPAIR');
const multisig = getKeypairFromEnvironment('MULTISIG_WALLET');
const mintKeypair = getKeypairFromEnvironment('MINT_WALLET');

const mint = await createMint(
  connection,
  payer,
  multisig.publicKey,
  null,
  9,
  mintKeypair
);

console.log(mint.toBase58());
