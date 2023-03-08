// Copyright 2020-2023 Litentry Technologies GmbH.
// This file is part of Litentry.
//
// Litentry is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Litentry is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Litentry.  If not, see <https://www.gnu.org/licenses/>.

// This file includes the predefined rulesets and the corresponding parameters
// when requesting VCs.

use crate::Balance;
use codec::{Decode, Encode, MaxEncodedLen};
use scale_info::TypeInfo;
use sp_runtime::{traits::ConstU32, BoundedVec};

// pub type Balance = u128;
type MaxStringLength = ConstU32<64>;
pub type ParameterString = BoundedVec<u8, MaxStringLength>;
pub type Network = BoundedVec<u8, MaxStringLength>;
pub type AssertionNetworks = BoundedVec<Network, MaxStringLength>;

#[derive(Encode, Decode, Clone, Debug, PartialEq, Eq, TypeInfo, MaxEncodedLen)]
pub enum Assertion {
	A1,
	A2(ParameterString),                                   // (guild_id)
	A3(ParameterString, ParameterString, ParameterString), // (guild_id, channel_id, role_id)
	A4(Balance),                                           // (minimum_amount)
	A5(ParameterString, ParameterString),                  // (twitter_account, tweet_id)
	A6,
	A7(Balance),           // (minimum_amount)
	A8(AssertionNetworks), // litentry, litmus, polkadot, kusama, khala, ethereum
	A9,
	A10(Balance), // (minimum_amount)
	A11(Balance), // (minimum_amount)
	A13(u32),     // (Karma_amount) - TODO: unsupported
}

pub const ASSERTION_NETWORKS: [&str; 6] =
	["litentry", "litmus", "polkadot", "kusama", "khala", "ethereum"];

pub const ASSERTION_FROM_DATE: [&str; 7] = [
	"2017-01-01",
	"2018-01-01",
	"2019-01-01",
	"2020-01-01",
	"2021-01-01",
	"2022-01-01",
	"2023-01-01",
];