import 'dotenv/config';
import {
  getExplorerLink,
  getKeypairFromEnvironment,
  makeTokenMint,
} from '@solana-developers/helpers';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createMint,
  createSetAuthorityInstruction,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';

async function main() {
  const sender = getKeypairFromEnvironment('SOLANA_KEYPAIR');
  const connection = new Connection(
    'https://api.devnet.solana.com',
    'confirmed'
  );

  // const name = 'KUMEKA TOKEN';
  // const symbol = 'KUMEKA';
  const decimals = 9;
  // const uri =
  //   'https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-token-metadata.json';

  // const additionalMetadata = {
  //   learn: 'true',
  //   earn: 'true',
  //   build: 'true',
  // };

  const mint = await createMint(
    connection,
    sender,
    sender.publicKey,
    sender.publicKey,
    decimals,
  );

  const explorerLink = getExplorerLink('address', mint.toBase58(), 'devnet');

  console.log(`Mint: ${mint.toBase58()}`);
  console.log(`Explorer: ${explorerLink}`);
}

main().catch(console.error);
