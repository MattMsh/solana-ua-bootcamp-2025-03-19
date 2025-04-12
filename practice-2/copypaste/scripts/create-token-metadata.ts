import 'dotenv/config';
import {
  getExplorerLink,
  getKeypairFromEnvironment,
} from '@solana-developers/helpers';
import {
  Connection,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
} from '@solana/web3.js';
import { createCreateMetadataAccountV3Instruction } from '@metaplex-foundation/mpl-token-metadata';

const user = getKeypairFromEnvironment('SOLANA_KEYPAIR');
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

const tokenMintAccount = new PublicKey(
  '7k1ErevStwY3z1t8YikAJT5TeUYMyDJ4nd5piCshp43e'
);

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
);

const metadataData = {
  name: 'Solana UA Bootcamp 2025-03-19',
  symbol: 'UAB-3',
  uri: 'https://raw.githubusercontent.com/solana-developers/professional-education/main/labs/sample-token-metadata.json',
  sellerFeeBasisPoints: 0,
  creators: null,
  collection: null,
  uses: null,
};

const [metadataPDA] = PublicKey.findProgramAddressSync(
  [
    Buffer.from('metadata'),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    tokenMintAccount.toBuffer(),
  ],
  TOKEN_METADATA_PROGRAM_ID
);

const transaction = new Transaction();
const createMetadataAccountInstruction =
  createCreateMetadataAccountV3Instruction(
    {
      metadata: metadataPDA,
      mint: tokenMintAccount,
      mintAuthority: user.publicKey,
      payer: user.publicKey,
      updateAuthority: user.publicKey,
    },
    {
      createMetadataAccountArgsV3: {
        collectionDetails: null,
        data: metadataData,
        isMutable: true,
      },
    }
  );
transaction.add(createMetadataAccountInstruction);

await sendAndConfirmTransaction(connection, transaction, [user]);

const tokenMintLink = getExplorerLink(
  'address',
  tokenMintAccount.toString(),
  'devnet'
);
console.log(`✅ Look at the token mint again: ${tokenMintLink}!`);
