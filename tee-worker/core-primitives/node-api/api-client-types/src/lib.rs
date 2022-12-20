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

//! Contains type definitions to talk to the node.
//!
//! You need to update this if you have a signed extension in your node that
//! is different from the integritee-node, e.g., if you use the `pallet_asset_tx_payment`.

#![cfg_attr(not(feature = "std"), no_std)]

pub use substrate_api_client::{
	BaseExtrinsicParams, BaseExtrinsicParamsBuilder, PlainTip, SubstrateDefaultSignedExtra,
	UncheckedExtrinsicV4,
};

pub type BalanceFor<Runtime> = <Runtime as pallet_balances::Config>::Balance;
pub type HashFor<Runtime> = <Runtime as frame_system::Config>::Hash;
pub type IndexFor<Runtime> = <Runtime as frame_system::Config>::Index;

/// Configuration for the ExtrinsicParams.
///
/// Valid for the default integritee node
pub type ParentchainExtrinsicParams<Runtime> =
	BaseExtrinsicParams<PlainTip<BalanceFor<Runtime>>, IndexFor<Runtime>, HashFor<Runtime>>;

pub type ParentchainExtrinsicParamsBuilder<Runtime> =
	BaseExtrinsicParamsBuilder<PlainTip<BalanceFor<Runtime>>, HashFor<Runtime>>;

// Pay in asset fees.
//
// This needs to be used if the node uses the `pallet_asset_tx_payment`.
//pub type ParentchainExtrinsicParams = AssetTipExtrinsicParams;
//pub type ParentchainExtrinsicParamsBuilder = AssetTipExtrinsicParamsBuilder;

// pub type Runtime = BalancesConfig + FrameSystemConfig;

pub type ParentchainUncheckedExtrinsic<Call, Runtime> =
	UncheckedExtrinsicV4<Call, SubstrateDefaultSignedExtra<PlainTip<BalanceFor<Runtime>>, u32>>;

#[cfg(feature = "std")]
pub use api::*;

#[cfg(feature = "std")]
mod api {
	use super::ParentchainExtrinsicParams;
	use substrate_api_client::Api;

	pub use substrate_api_client::{
		api::Error as ApiClientError, rpc::TungsteniteRpcClient as WsRpcClient,
	};

	pub type ParentchainApi<Runtime> =
		Api<sp_core::sr25519::Pair, WsRpcClient, ParentchainExtrinsicParams<Runtime>, Runtime>;
}
