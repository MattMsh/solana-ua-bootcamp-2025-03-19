import { Program, BN, web3, utils } from '@coral-xyz/anchor';
import { fromWorkspace, LiteSVMProvider } from 'anchor-litesvm';
import IDL from '../target/idl/favorites.json';
import { Favorites } from '../target/types/favorites';

describe('favorites', () => {
  // Configure the client to use the local cluster.
  const client = fromWorkspace('.');
  const provider = new LiteSVMProvider(client);
  const program = new Program<Favorites>(IDL, provider);
  const user = provider.publicKey;

  const [favoritesPda, _favoritesBump] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('favorites'), user.toBuffer()],
    program.programId
  );

  it('Set favorites', async () => {
    const tx = await program.methods.setFavorites(new BN(1), 'red').rpc();
    console.log('Your transaction signature', tx);

    const account = await program.account.favorites.fetch(favoritesPda);
    expect(account.color).toEqual('red');
    expect(account.number.toNumber()).toEqual(1);
  });

  it('Update favorites', async () => {
    const tx = await program.methods.updateFavorites(new BN(2), 'green').rpc();
    console.log('Your transaction signature', tx);

    const account = await program.account.favorites.fetch(favoritesPda);
    expect(account.color).toEqual('green');
    expect(account.number.toNumber()).toEqual(2);
  });

    it('Partially update color', async () => {
      const accountBefore = await program.account.favorites.fetch(favoritesPda);
      const tx = await program.methods.updateFavorites(null, 'blue').rpc();
      console.log('Your transaction signature', tx);

      const account = await program.account.favorites.fetch(favoritesPda);
      expect(account.color).toEqual('blue');
      expect(account.number.toNumber()).toEqual(accountBefore.number.toNumber());
    });

    it('Partially update number', async () => {
      const accountBefore = await program.account.favorites.fetch(favoritesPda);
      const tx = await program.methods.updateFavorites(new BN(3), null).rpc();
      console.log('Your transaction signature', tx);

      const account = await program.account.favorites.fetch(favoritesPda);
      expect(account.color).toEqual(accountBefore.color);
      expect(account.number.toNumber()).toEqual(3);
    });
});
