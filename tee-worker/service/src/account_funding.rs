/*
	Copyright 2021 Integritee AG and Supercomputing Systems AG

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

		http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.

*/

use crate::error::{Error, ServiceResult};
use codec::Encode;
use itp_node_api::api_client::{AccountApi, ParentchainApi};
use itp_settings::worker::{
	EXISTENTIAL_DEPOSIT_FACTOR_FOR_INIT_FUNDS, REGISTERING_FEE_FACTOR_FOR_INIT_FUNDS,
};
use itp_types::RuntimeConfigCollection;
use log::*;
use serde::de::DeserializeOwned;
use sp_core::{
	crypto::{AccountId32, Ss58Codec},
	Pair,
};
use sp_keyring::AccountKeyring;
use substrate_api_client::{
	FromHexString, GenericAddress, GetBalance, GetTransactionPayment, SubmitAndWatch, XtStatus,
};

/// Information about the enclave on-chain account.
pub trait EnclaveAccountInfo {
	fn free_balance(&self) -> ServiceResult<u128>;
}

pub struct EnclaveAccountInfoProvider<Runtime: RuntimeConfigCollection> {
	node_api: ParentchainApi<Runtime>,
	account_id: Runtime::AccountId,
}

impl<Runtime: RuntimeConfigCollection> EnclaveAccountInfo for EnclaveAccountInfoProvider<Runtime> {
	fn free_balance(&self) -> ServiceResult<u128> {
		self.node_api.get_free_balance(&self.account_id).map_err(|e| e.into())
	}
}

impl<Runtime: RuntimeConfigCollection> EnclaveAccountInfoProvider<Runtime> {
	pub fn new(node_api: ParentchainApi<Runtime>, account_id: Runtime::AccountId) -> Self {
		EnclaveAccountInfoProvider { node_api, account_id }
	}
}

pub fn setup_account_funding<Runtime>(
	api: &ParentchainApi<Runtime>,
	accountid: &AccountId32,
	extrinsic_prefix: String,
	is_development_mode: bool,
) -> ServiceResult<()>
where
	Runtime: RuntimeConfigCollection,
	Runtime::Hash: FromHexString,
	Runtime::Header: DeserializeOwned,
	Runtime::RuntimeBlock: DeserializeOwned,
{
	// Account funds
	if is_development_mode {
		// Development mode, the faucet will ensure that the enclave has enough funds
		ensure_account_has_funds(api, accountid)?;
	} else {
		// Production mode, there is no faucet.
		let registration_fees = enclave_registration_fees(api, &extrinsic_prefix)?;
		info!("Registration fees = {:?}", registration_fees);
		let free_balance = api.get_free_balance(accountid)?;
		info!("TEE's free balance = {:?}", free_balance);

		let min_required_funds =
			registration_fees.saturating_mul(REGISTERING_FEE_FACTOR_FOR_INIT_FUNDS);
		let missing_funds = min_required_funds.saturating_sub(free_balance);

		if missing_funds > 0 {
			// If there are not enough funds, then the user can send the missing TEER to the enclave address and start again.
			println!(
				"Enclave account: {:}, missing funds {}",
				accountid.to_ss58check(),
				missing_funds
			);
			return Err(Error::Custom(
				"Enclave does not have enough funds on the parentchain to register.".into(),
			))
		}
	}
	Ok(())
}

// Alice plays the faucet and sends some funds to the account if balance is low
fn ensure_account_has_funds<Runtime>(
	api: &ParentchainApi<Runtime>,
	accountid: &AccountId32,
) -> Result<(), Error>
where
	Runtime: RuntimeConfigCollection,
	Runtime::Hash: FromHexString,
	Runtime::Header: DeserializeOwned,
	Runtime::RuntimeBlock: DeserializeOwned,
{
	// check account balance
	let free_balance = api.get_free_balance(accountid)?;
	info!("TEE's free balance = {:?} (Account: {})", free_balance, accountid);

	let existential_deposit = api.get_existential_deposit()?;
	info!("Existential deposit is = {:?}", existential_deposit);

	let min_required_funds =
		existential_deposit.saturating_mul(EXISTENTIAL_DEPOSIT_FACTOR_FOR_INIT_FUNDS);
	let missing_funds = min_required_funds.saturating_sub(free_balance);

	if missing_funds > 0 {
		info!("Transfer {:?} from Alice to {}", missing_funds, accountid);
		bootstrap_funds_from_alice(api, accountid, missing_funds)?;
	}
	Ok(())
}

fn enclave_registration_fees<Runtime: RuntimeConfigCollection>(
	api: &ParentchainApi<Runtime>,
	xthex_prefixed: &str,
) -> Result<u128, Error> {
	let reg_fee_details = api.get_fee_details(xthex_prefixed, None)?;
	match reg_fee_details {
		Some(details) => match details.inclusion_fee {
			Some(fee) => Ok(fee.inclusion_fee()),
			None => Err(Error::Custom(
				"Inclusion fee for the registration of the enclave is None!".into(),
			)),
		},
		None =>
			Err(Error::Custom("Fee Details for the registration of the enclave is None !".into())),
	}
}

// Alice sends some funds to the account
fn bootstrap_funds_from_alice<Runtime>(
	api: &ParentchainApi<Runtime>,
	accountid: &AccountId32,
	funding_amount: u128,
) -> Result<(), Error>
where
	Runtime: RuntimeConfigCollection,
	Runtime::Hash: FromHexString,
	Runtime::Header: DeserializeOwned,
	Runtime::RuntimeBlock: DeserializeOwned,
{
	let alice = AccountKeyring::Alice.pair();
	info!("encoding Alice's public 	= {:?}", alice.public().0.encode());
	let alice_acc = AccountId32::from(*alice.public().as_array_ref());
	info!("encoding Alice's AccountId = {:?}", alice_acc.encode());

	let alice_free = api.get_free_balance(&alice_acc)?;
	info!("    Alice's free balance = {:?}", alice_free);
	let nonce = api.get_nonce_of(&alice_acc)?;
	info!("    Alice's Account Nonce is {}", nonce);

	if funding_amount > alice_free {
		println!(
            "funding amount is too high: please change EXISTENTIAL_DEPOSIT_FACTOR_FOR_INIT_FUNDS ({:?})",
            funding_amount
        );
		return Err(Error::ApplicationSetup)
	}

	let mut alice_signer_api = api.clone();
	alice_signer_api.set_signer(alice);

	println!("[+] bootstrap funding Enclave from Alice's funds");
	let xt =
		alice_signer_api.balance_transfer(GenericAddress::Id(accountid.clone()), funding_amount);
	let xt_hash = alice_signer_api
		.submit_and_watch_extrinsic_until(xt.hex_encode().as_str(), XtStatus::InBlock)?;
	info!("[<] Extrinsic got included in a block. Hash: {:?}\n", xt_hash);

	// Verify funds have arrived.
	let free_balance = alice_signer_api.get_free_balance(accountid);
	info!("TEE's NEW free balance = {:?}", free_balance);

	Ok(())
}
