use anchor_lang::prelude::*;

declare_id!("CSWm1651uJy1NavUNjA5PdVB98fY3pKkCYkJBcugzrKa");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod favorites {
    use super::*;

    pub fn set_favorites_legacy(
        ctx: Context<SetFavoritesLegacy>,
        number: u64,
        color: String,
    ) -> Result<()> {
        let user_pubkey = ctx.accounts.user.key();
        msg!("Greetings from: {}", ctx.program_id);
        msg!(
            "User {}'s favorite number is: {} and favorite color is: {}",
            user_pubkey,
            number,
            color
        );
        ctx.accounts
            .favorites
            .set_inner(FavoritesLegacy { number, color });
        Ok(())
    }

    pub fn set_favorites(
        ctx: Context<SetFavorites>,
        number: u64,
        color: String,
        update_authority: Option<Pubkey>,
    ) -> Result<()> {
        let user_pubkey = ctx.accounts.user.key();
        msg!("Greetings from: {}", ctx.program_id);
        msg!(
            "User {}'s favorite number is: {} and favorite color is: {}",
            user_pubkey,
            number,
            color
        );
        ctx.accounts.favorites.set_inner(Favorites {
            owner: user_pubkey,
            number,
            color,
            update_authority,
        });
        Ok(())
    }

    pub fn set_authority(
        ctx: Context<SetAuthority>,
        update_authority: Option<Pubkey>,
    ) -> Result<()> {
        ctx.accounts.favorites.update_authority = update_authority;
        Ok(())
    }

    pub fn update_favorites(
        ctx: Context<UpdateFavorites>,
        number: Option<u64>,
        color: Option<String>,
    ) -> Result<()> {
        let user = ctx.accounts.user.key();
        let favorites = &mut ctx.accounts.favorites;

        assert!(favorites.owner == user || favorites.update_authority == Some(user));

        match number {
            Some(number) => favorites.number = number,
            None => (),
        }

        match color {
            Some(color) => favorites.color = color,
            None => (),
        }

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SetFavoritesLegacy<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + FavoritesLegacy::INIT_SPACE,
        seeds = [b"favorites", user.key().as_ref()],
        bump,
    )]
    pub favorites: Account<'info, FavoritesLegacy>,

    pub system_program: Program<'info, System>,
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

#[derive(Accounts)]
pub struct UpdateFavorites<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    pub owner: SystemAccount<'info>,

    #[account(mut, seeds = [b"favorites", owner.key().as_ref()], bump)]
    pub favorites: Account<'info, Favorites>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetAuthority<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(mut, seeds = [b"favorites", user.key().as_ref()], bump)]
    pub favorites: Account<'info, Favorites>,
}

#[account]
#[derive(InitSpace)]
pub struct FavoritesLegacy {
    pub number: u64,
    #[max_len(50)]
    pub color: String,
}

#[account]
#[derive(InitSpace)]
pub struct Favorites {
    pub number: u64,
    #[max_len(50)]
    pub color: String,
    pub owner: Pubkey,
    pub update_authority: Option<Pubkey>,
}
