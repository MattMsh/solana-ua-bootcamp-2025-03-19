import 'dotenv/config';
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { createMultisig } from '@solana/spl-token';
import {
  addKeypairToEnvFile,
  getKeypairFromEnvironment,
  getKeypairFromFile,
  initializeKeypair,
} from '@solana-developers/helpers';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const payer = getKeypairFromEnvironment('PAYER_KEYPAIR');

const secondWallet = await getKeypairFromFile(
  './2JzMfCQWe9vTwXZcdEVv8zrwFJZTo56cd6yKHBJVzrwE.json'
);

const thirdWallet = await getKeypairFromFile(
  './3b6DZ9yaEvDH4AZ2zwJSu8oUjLJgbtWibnKe553MucTK.json'
);

// create multisig wallet
const multisigWallet = Keypair.generate();

const multisig = await createMultisig(
  connection,
  payer,
  [payer.publicKey, secondWallet.publicKey, thirdWallet.publicKey],
  3,
  multisigWallet
);

console.log(multisig.toBase58());
addKeypairToEnvFile(multisigWallet, 'MULTISIG_WALLET');
