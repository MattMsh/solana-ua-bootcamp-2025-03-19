pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("9tQv71YJmYrQ1feywz73QrKff2ryYTEnu6HgbfghinDc");

#[program]
pub mod delegate_escrow {
    use super::*;

    pub fn make_offer(
        context: Context<MakeOffer>,
        id: u64,
        token_a_offered_amount: u64,
        token_b_wanted_amount: u64,
    ) -> Result<()> {
        instructions::make_offer::approve_offered_tokens(&context, token_a_offered_amount)?;
        instructions::make_offer::save_offer(
            context,
            id,
            token_a_offered_amount,
            token_b_wanted_amount,
        )
    }

    pub fn take_offer(context: Context<TakeOffer>) -> Result<()> {
        instructions::take_offer::send_wanted_tokens_to_maker(&context)?;
        instructions::take_offer::withdraw(context)
    }
}
