import 'dotenv/config';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import {
  getKeypairFromEnvironment,
  getKeypairFromFile,
} from '@solana-developers/helpers';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const payer = getKeypairFromEnvironment('PAYER_KEYPAIR');
const secondWallet = await getKeypairFromFile(
  './2JzMfCQWe9vTwXZcdEVv8zrwFJZTo56cd6yKHBJVzrwE.json'
);
const thirdWallet = await getKeypairFromFile(
  './3b6DZ9yaEvDH4AZ2zwJSu8oUjLJgbtWibnKe553MucTK.json'
);

const mint = new PublicKey('MiNT9rLg9DH3bv3U7xNcbS4oPRwrQh8MnPZm44BoQr6');
const multisig = new PublicKey('FjSHcoL9janaBdACDtwJJ3e1CX4WD5UHxwSRo1c23kQB');

const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  payer,
  mint,
  payer.publicKey
);

const mintToken = await mintTo(
  connection,
  payer,
  mint,
  associatedTokenAccount.address,
  multisig,
  1000000000,
  [payer, secondWallet, thirdWallet]
);

console.log(mintToken);
