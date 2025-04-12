import {
  addKeypairToEnvFile,
  airdropIfRequired,
  getKeypairFromFile,
} from '@solana-developers/helpers';
import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  NONCE_ACCOUNT_LENGTH,
  sendAndConfirmRawTransaction,
} from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const nonceAuthKP = await getKeypairFromFile('./nonce_auth.json');

const nonceKeypair = Keypair.generate();
const tx = new Transaction();

tx.feePayer = nonceAuthKP.publicKey;
tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

tx.add(
  SystemProgram.createAccount({
    fromPubkey: nonceAuthKP.publicKey,
    newAccountPubkey: nonceKeypair.publicKey,
    lamports: 0.0015 * LAMPORTS_PER_SOL,
    space: NONCE_ACCOUNT_LENGTH,
    programId: SystemProgram.programId,
  }),
  SystemProgram.nonceInitialize({
    noncePubkey: nonceKeypair.publicKey,
    authorizedPubkey: nonceAuthKP.publicKey,
  })
);

// sign the transaction with both the nonce keypair and the authority keypair
tx.sign(nonceKeypair, nonceAuthKP);

// send the transaction
const sig = await sendAndConfirmRawTransaction(
  connection,
  tx.serialize({ requireAllSignatures: false })
);
console.log('Nonce initiated: ', sig);
