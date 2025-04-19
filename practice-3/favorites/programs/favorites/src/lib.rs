use anchor_lang::prelude::*;

declare_id!("2CSJNDocDy6x191gA1tRtuAcaC9iUV43XW5UdtuCUmTw");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod favorites {
    use super::*;

    pub fn set_favorites(ctx: Context<SetFavorites>, number: u64, color: String) -> Result<()> {
        let user_pubkey = ctx.accounts.user.key();
        msg!("Greetings from: {}", ctx.program_id);
        msg!("User {}'s favorite number is: {} and favorite color is: {}", user_pubkey, number, color);
        ctx.accounts.favorites.set_inner(Favorites { number, color });
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SetFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Favorites::INIT_SPACE,
        seeds = [b"favorites", user.key().as_ref()],
        bump,
    )]
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Favorites {
    pub number: u64,
    #[max_len(50)]
    pub color: String,
}
