pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("3rYLkS7iHo4hbLgViUkA3UpX8AvviSXx874uMvyxMRyR");

#[program]
pub mod escrow {
    use super::*;

    pub fn make_offer(
        ctx: Context<MakeOffer>,
        id: u64,
        token_a_offered_amount: u64,
        token_b_wanted_amount: u64,
    ) -> Result<()> {
        instructions::make_offer::send_offered_tokens_to_vault(&ctx, token_a_offered_amount)?;
        instructions::make_offer::save_offer(ctx, id, token_b_wanted_amount)
    }

    pub fn take_offer(context: Context<TakeOffer>) -> Result<()> {
        instructions::take_offer::send_wanted_tokens_to_maker(&context)?;
        msg!("Sended wanted tokens to maker");
        instructions::take_offer::withdraw_and_close_vault(context)
    }

    pub fn close_offer(context: Context<CloseOffer>, id: u64) -> Result<()> {
        instructions::close_offer::close_offer(context, id)
    }
}
