import 'dotenv/config';
import bs58 from 'bs58';
import {
  getKeypairFromEnvironment,
  getKeypairFromFile,
} from '@solana-developers/helpers';
import {
  createMintToInstruction,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token';
import {
  clusterApiUrl,
  Connection,
  NonceAccount,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const nonceAuthKP = await getKeypairFromFile('./nonce_auth.json');

const noncePubKey = new PublicKey(
  '3bh2kfAg3rwg2qrWvriZPvQDJoee2DxPsh831kAirGdR'
);

const accountInfo = await connection.getAccountInfo(noncePubKey);
if (!accountInfo) {
  process.exit(1);
}
const nonceAccount = NonceAccount.fromAccountData(accountInfo.data);

const payer = getKeypairFromEnvironment('PAYER_KEYPAIR');
const secondWallet = await getKeypairFromFile(
  './2JzMfCQWe9vTwXZcdEVv8zrwFJZTo56cd6yKHBJVzrwE.json'
);

const mint = new PublicKey('MiNT9rLg9DH3bv3U7xNcbS4oPRwrQh8MnPZm44BoQr6');
const multisig = new PublicKey('FjSHcoL9janaBdACDtwJJ3e1CX4WD5UHxwSRo1c23kQB');

const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  payer,
  mint,
  payer.publicKey
);

const thirdPublicKey = new PublicKey(
  '3b6DZ9yaEvDH4AZ2zwJSu8oUjLJgbtWibnKe553MucTK'
);

const ix = createMintToInstruction(
  mint,
  associatedTokenAccount.address,
  multisig,
  1000000000,
  [payer, secondWallet, thirdPublicKey]
);

const advanceIX = SystemProgram.nonceAdvance({
  authorizedPubkey: nonceAuthKP.publicKey,
  noncePubkey: noncePubKey,
});

const tx = new Transaction();
tx.add(advanceIX);
tx.add(ix);

tx.recentBlockhash = nonceAccount.nonce;
tx.feePayer = payer.publicKey;

tx.sign(nonceAuthKP, payer, secondWallet);

const serialisedTx = bs58.encode(tx.serialize({ requireAllSignatures: false }));
console.log('Signed Durable Transaction: ', serialisedTx);
