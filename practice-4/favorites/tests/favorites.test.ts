import { Program, BN, web3, utils } from '@coral-xyz/anchor';
import { fromWorkspace, LiteSVMProvider } from 'anchor-litesvm';
import IDL from '../target/idl/favorites.json';
import { Favorites } from '../target/types/favorites';

describe('favorites', () => {
  // Configure the client to use the local cluster.
  const client = fromWorkspace('.');
  const provider = new LiteSVMProvider(client);
  const program = new Program<Favorites>(IDL, provider);
  const user = provider.wallet.payer;
  const delegate = web3.Keypair.generate();

  const [favoritesPda, _favoritesBump] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('favorites'), user.publicKey.toBuffer()],
    program.programId
  );

  it('Set favorites', async () => {
    const tx = await program.methods.setFavorites(new BN(1), 'red', null).rpc();
    console.log('Your transaction signature', tx);

    const account = await program.account.favorites.fetch(favoritesPda);
    expect(account.color).toEqual('red');
    expect(account.number.toNumber()).toEqual(1);
  });

  it('Update favorites', async () => {
    const tx = await program.methods
      .updateFavorites(new BN(2), 'green')
      .accounts({ owner: user.publicKey })
      .rpc();
    console.log('Your transaction signature', tx);

    const account = await program.account.favorites.fetch(favoritesPda);
    expect(account.color).toEqual('green');
    expect(account.number.toNumber()).toEqual(2);
  });

  it('Partially update color', async () => {
    const accountBefore = await program.account.favorites.fetch(favoritesPda);
    const tx = await program.methods
      .updateFavorites(null, 'blue')
      .accounts({ owner: user.publicKey })
      .rpc();
    console.log('Your transaction signature', tx);

    const account = await program.account.favorites.fetch(favoritesPda);
    expect(account.color).toEqual('blue');
    expect(account.number.toNumber()).toEqual(accountBefore.number.toNumber());
  });

  it('Partially update number', async () => {
    const accountBefore = await program.account.favorites.fetch(favoritesPda);
    const tx = await program.methods
      .updateFavorites(new BN(3), null)
      .accounts({ owner: user.publicKey })
      .rpc();
    console.log('Your transaction signature', tx);

    const account = await program.account.favorites.fetch(favoritesPda);
    expect(account.color).toEqual(accountBefore.color);
    expect(account.number.toNumber()).toEqual(3);
  });

  it('Set authority', async () => {
    const tx = await program.methods.setAuthority(delegate.publicKey).rpc();
    console.log('Your transaction signature', tx);

    const account = await program.account.favorites.fetch(favoritesPda);
    expect(account.updateAuthority.toBase58()).toEqual(
      delegate.publicKey.toBase58()
    );
  });

  it('Update favorites with authority', async () => {
    const tx = await program.methods
      .updateFavorites(new BN(4), 'yellow')
      .accounts({ user: delegate.publicKey, owner: user.publicKey })
      .signers([delegate])
      .rpc();
    console.log('Your transaction signature', tx);

    const account = await program.account.favorites.fetch(favoritesPda);
    expect(account.color).toEqual('yellow');
    expect(account.number.toNumber()).toEqual(4);
  });

  it('Revoke update authority', async () => {
    const tx = await program.methods.setAuthority(null).rpc();
    console.log('Your transaction signature', tx);

    const account = await program.account.favorites.fetch(favoritesPda);
    expect(account.updateAuthority).toBeNull();
  });
});
