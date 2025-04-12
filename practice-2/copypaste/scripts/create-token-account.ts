import { getExplorerLink, getKeypairFromEnvironment } from '@solana-developers/helpers';
import { getOrCreateAssociatedTokenAccount, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import 'dotenv/config';

const user = getKeypairFromEnvironment('SOLANA_KEYPAIR');
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

console.log(
  `🔑 Loaded our keypair securely, using an env file! Our public key is: ${user.publicKey.toBase58()}`
);

const tokenMintAccount = new PublicKey("Dbt9EAkXJx4oHKaV4MN96W2rrAa17xqK9SUUX67CpNjz")

const recipient = Keypair.generate().publicKey;

const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
  connection,
  user,
  tokenMintAccount,
  recipient,
  false,
  'confirmed',
  {},
  TOKEN_2022_PROGRAM_ID
)

console.log(
  `Associated token Account: ${associatedTokenAccount.address.toBase58()}`
);

const link = getExplorerLink(
  "address",
  associatedTokenAccount.address.toBase58(),
  "devnet"
);

console.log(`✅ Success! Created associated token Account: ${link}`);



