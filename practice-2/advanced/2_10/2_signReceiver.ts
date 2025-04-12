import 'dotenv/config';
import {
  getKeypairFromEnvironment,
  getKeypairFromFile,
  getExplorerLink,
} from '@solana-developers/helpers';
import { Connection, Transaction, clusterApiUrl } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount } from '@solana/spl-token';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const receiver = await getKeypairFromFile(
  './2JzMfCQWe9vTwXZcdEVv8zrwFJZTo56cd6yKHBJVzrwE.json'
);

const mint = getKeypairFromEnvironment('MINT_WALLET').publicKey;

await getOrCreateAssociatedTokenAccount(
  connection,
  receiver,
  mint,
  receiver.publicKey
);

const base64Tx =
  'AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwrwxaVTNaxWuVKl/QOSAOEM0NnU/xoNg7HPBrY+N0obWzw5IuG5LiYl06VSidZNtSXq9rg24/+FNKNbiDCK0BAgEBBRN3adycWgkFVGa0/ZWtCDvyX6c7Isv2IcE4NuHeUQz1G6BFJJiAfwskEbpoJJvt39lCnRmc+6HVQYw9jwOAtWEVE2nvj5ITWqe1CglOLBqJzZrlxeOg9Kk9lGbSOOlHoaWxEnO4FH8jbSnsAFIRAls3KEO6nheNr1+d5PxJA6UVBt324ddloZPZy+FGzut5rBy0he1fWzeROoz1hX7/AKloDGVY2aaY61862YYyScomJi2hnEXDS5+t9YP5247T1wEEAwMCAQkDAMqaOwAAAAA=';

const rawTx = Buffer.from(base64Tx, 'base64');

const tx = Transaction.from(rawTx);

tx.partialSign(receiver);

const serializedTx = tx.serialize();

const txHash = await connection.sendRawTransaction(serializedTx);

console.log(getExplorerLink('tx', txHash, 'devnet'));
