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

use crate::{error::Result, executor::Executor, IndirectCallsExecutor};
use itp_node_api::{
	api_client::ParentchainUncheckedExtrinsic,
	metadata::{
		pallet_imp::IMPCallIndexes, pallet_teerex::TeerexCallIndexes,
		pallet_utility::UtilityCallIndexes, pallet_vcmp::VCMPCallIndexes,
		provider::AccessNodeMetadata,
	},
};
use itp_sgx_crypto::{key_repository::AccessKey, ShieldingCryptoDecrypt, ShieldingCryptoEncrypt};
use itp_stf_executor::traits::StfEnclaveSigning;
use itp_top_pool_author::traits::AuthorApi;
use itp_types::{CallWorkerFn, H256};
use log::*;

pub struct CallWorker {}

impl<ShieldingKeyRepository, StfEnclaveSigner, TopPoolAuthor, NodeMetadataProvider>
	Executor<ShieldingKeyRepository, StfEnclaveSigner, TopPoolAuthor, NodeMetadataProvider>
	for CallWorker
where
	ShieldingKeyRepository: AccessKey,
	<ShieldingKeyRepository as AccessKey>::KeyType: ShieldingCryptoDecrypt<Error = itp_sgx_crypto::Error>
		+ ShieldingCryptoEncrypt<Error = itp_sgx_crypto::Error>,
	StfEnclaveSigner: StfEnclaveSigning,
	TopPoolAuthor: AuthorApi<H256, H256> + Send + Sync + 'static,
	NodeMetadataProvider: AccessNodeMetadata,
	NodeMetadataProvider::MetadataType:
		IMPCallIndexes + TeerexCallIndexes + VCMPCallIndexes + UtilityCallIndexes,
{
	type Call = CallWorkerFn;

	fn call_index(&self, call: &Self::Call) -> [u8; 2] {
		call.0
	}

	fn call_index_from_metadata(
		&self,
		metadata_type: &NodeMetadataProvider::MetadataType,
	) -> Result<[u8; 2]> {
		metadata_type.call_worker_call_indexes().map_err(|e| e.into())
	}

	fn execute(
		&self,
		context: &IndirectCallsExecutor<
			ShieldingKeyRepository,
			StfEnclaveSigner,
			TopPoolAuthor,
			NodeMetadataProvider,
		>,
		extrinsic: ParentchainUncheckedExtrinsic<Self::Call>,
	) -> Result<()> {
		let (_, request) = extrinsic.function;
		let (shard, cypher_text) = (request.shard, request.cyphertext);
		debug!("Found trusted call extrinsic, submitting it to the top pool");
		context.submit_trusted_call(shard, cypher_text);
		Ok(())
	}
}
