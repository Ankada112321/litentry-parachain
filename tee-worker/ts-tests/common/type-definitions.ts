import { ApiPromise, Keyring } from '@polkadot/api';
import { KeyObject } from 'crypto';
import { HexString } from '@polkadot/util/types';
import WebSocketAsPromised = require('websocket-as-promised');
import { KeyringPair } from '@polkadot/keyring/types';
import { ApiTypes, SubmittableExtrinsic } from '@polkadot/api/types';
import { Metadata } from '@polkadot/types';
import { ethers } from 'ethers';
export const teeTypes = {
    WorkerRpcReturnString: {
        vec: 'Bytes',
    },
    WorkerRpcReturnValue: {
        value: 'Bytes',
        do_watch: 'bool',
        status: 'DirectRequestStatus',
    },
    TrustedOperation: {
        _enum: {
            indirect_call: '(TrustedCallSigned)',
            direct_call: '(TrustedCallSigned)',
            get: '(Getter)',
        },
    },
    TrustedCallSigned: {
        call: 'TrustedCall',
        index: 'u32',
        signature: 'MultiSignature',
    },
    Getter: {
        _enum: {
            public: '(PublicGetter)',
            trusted: '(TrustedGetterSigned)',
        },
    },
    PublicGetter: {
        _enum: ['some_value'],
    },
    TrustedGetterSigned: {
        getter: 'TrustedGetter',
        signature: 'MultiSignature',
    },

    /// important
    TrustedGetter: {
        _enum: {
            free_balance: '(AccountId)',
        },
    },
    /// important
    TrustedCall: {
        _enum: {
            balance_set_balance: '(AccountId, AccountId, Balance, Balance)',
            balance_transfer: '(AccountId, AccountId, Balance)',
            balance_unshield: '(AccountId, AccountId, Balance, mrEnclaveIdentifier)',
        },
    },
    DirectRequestStatus: {
        _enum: [
            //TODO support TrustedOperationStatus(TrustedOperationStatus)
            'Ok',
            'TrustedOperationStatus',
            'Error',
        ],
    },

    /// identity
    LitentryIdentity: {
        _enum: {
            Substrate: 'SubstrateIdentity',
            Evm: 'EvmIdentity',
            Web2: 'Web2Identity',
        },
    },
    SubstrateIdentity: {
        network: 'SubstrateNetwork',
        address: 'Address32',
    },
    EvmIdentity: {
        network: 'EvmNetwork',
        address: 'Address20',
    },
    Web2Identity: {
        network: 'Web2Network',
        address: 'IdentityString',
    },
    Address32: '[u8;32]',
    Address20: '[u8;20]',
    IdentityString: 'Vec<u8>',
    Web2Network: {
        _enum: ['Twitter', 'Discord', 'Github'],
    },
    SubstrateNetwork: {
        _enum: ['Polkadot', 'Kusama', 'Litentry', 'Litmus', 'LitentryRococo', 'Khala', 'TestNet'],
    },
    EvmNetwork: {
        _enum: ['Ethereum', 'BSC'],
    },

    /// Validation Data
    LitentryValidationData: {
        _enum: {
            Web2Validation: 'Web2ValidationData',
            Web3Validation: 'Web3ValidationData',
        },
    },
    Web2ValidationData: {
        _enum: {
            Twitter: 'TwitterValidationData',
            Discord: 'DiscordValidationData',
        },
    },
    TwitterValidationData: {
        tweet_id: 'Vec<u8>',
    },
    DiscordValidationData: {
        channel_id: 'Vec<u8>',
        message_id: 'Vec<u8>',
        guild_id: 'Vec<u8>',
    },
    Web3ValidationData: {
        _enum: {
            Substrate: 'Web3CommonValidationData',
            Evm: 'Web3CommonValidationData',
        },
    },
    Web3CommonValidationData: {
        message: 'Vec<u8>',
        signature: 'IdentityMultiSignature',
    },

    IdentityMultiSignature: {
        _enum: {
            Ed25519: 'ed25519::Signature',
            Sr25519: 'sr25519::Signature',
            Ecdsa: 'ecdsa::Signature',
            Ethereum: 'EthereumSignature',
        },
    },
    EthereumSignature: '([u8; 65])',

    IdentityGenericEvent: {
        who: 'AccountId',
        identity: 'LitentryIdentity',
        id_graph: 'Vec<(LitentryIdentity, IdentityContext)>',
    },
    IdentityContext: {
        metadata: 'Option<Vec<u8>>',
        linking_request_block: 'Option<BlockNumber>',
        verification_request_block: 'Option<BlockNumber>',
        is_verified: 'bool',
    },

    // vc management
    VCRequested: {
        account: 'AccountId',
        mrEnclave: 'mrEnclaveIdentifier',
        assertion: 'Assertion',
    },
};

export type WorkerRpcReturnValue = {
    value: HexString;
    do_watch: boolean;
    status: string;
};

export type WorkerRpcReturnString = {
    vec: string;
};

export type EnclaveResult = {
    mrEnclave: `0x${string}`;
    shieldingKey: `0x${string}`;
    vcPubkey: `0x${string}`;
    sgxMetadata: {};
};

export type PubicKeyJson = {
    n: Uint8Array;
    e: Uint8Array;
};

export type IntegrationTestContext = {
    tee: WebSocketAsPromised;
    api: ApiPromise;
    teeShieldingKey: KeyObject;
    mrEnclave: HexString;
    ethersWallet: any;
    substrateWallet: any;
    metaData: Metadata;
    web3Signers: Web3Wallets[];
};

export class AESOutput {
    ciphertext?: Uint8Array;
    aad?: Uint8Array;
    nonce?: Uint8Array;
}

export type LitentryIdentity = {
    Substrate?: SubstrateIdentity;
    Evm?: EvmIdentity;
    Web2?: Web2Identity;
};

export type SubstrateIdentity = {
    network: SubstrateNetwork;
    address: HexString;
};

export type EvmIdentity = {
    network: EvmNetwork;
    address: HexString;
};

export type Web2Identity = {
    network: Web2Network;
    address: string;
};

export type IdentityHandle = {
    Address32?: HexString;
    Address20?: HexString;
    PlainString?: `0x${string}`;
};

export type LitentryValidationData = {
    Web2Validation?: Web2ValidationData;
    Web3Validation?: Web3ValidationData;
};

export type Web2ValidationData = {
    Twitter?: TwitterValidationData;
    Discord?: DiscordValidationData;
};

export type Web3ValidationData = {
    Substrate?: Web3CommonValidationData;
    Evm?: Web3CommonValidationData;
};

export type Web3CommonValidationData = {
    message: HexString;
    signature: IdentityMultiSignature;
};

export type IdentityMultiSignature = {
    Ethereum?: HexString;
    Ed25519?: HexString;
    Sr25519?: HexString;
};

export type Ed25519Signature = {
    Ed25519: HexString;
    Sr25519: HexString;
    Ecdsa: HexString;
    Ethereum: EthereumSignature;
};

export type EthereumSignature = HexString;

export type TwitterValidationData = {
    tweet_id: HexString;
};

export type DiscordValidationData = {
    channel_id: HexString;
    message_id: HexString;
    guild_id: HexString;
};

export type Web3Wallets = {
    substrateWallet: KeyringPair;
    ethereumWallet: ethers.Wallet;
};

// export type DiscordValidationData = {}

export type Web3Network = {
    Substrate?: SubstrateNetwork;
    Evm?: EvmNetwork;
};

export type Web2Network = 'Twitter' | 'Discord' | 'Github';
export type SubstrateNetwork = 'Polkadot' | 'Kusama' | 'Litentry' | 'Litmus' | 'LitentryRococo' | 'Khala' | 'TestNet';
export type EvmNetwork = 'Ethereum' | 'BSC';

export type IdentityGenericEvent = {
    who: HexString;
    identity: LitentryIdentity;
    idGraph: [LitentryIdentity, IdentityContext][];
    challengeCode?: HexString;
};

export type IdentityContext = {
    metadata?: HexString;
    linking_request_block?: number;
    verification_request_block?: number;
    is_verified: boolean;
};

//vc types
export type VCRequested = {
    account: HexString;
    mrEnclave: HexString;
    assertion: Assertion;
};

export enum IndexingNetwork {
    Litentry = 'Litentry',
    Litmus = 'Litmus',
    Polkadot = 'Polkadot',
    Kusama = 'Kusama',
    Khala = 'Khala',
    Ethereum = 'Ethereum',
}

export type Assertion = {
    A1?: string;
    A2?: [string];
    A3?: [string, string, string];
    A4?: string;
    A5?: [string, string];
    A6?: string;
    A7?: string;
    A8?: [IndexingNetwork];
    A9?: string;
    A10?: string;
    A11?: string;
};

export type TransactionSubmit = {
    tx: SubmittableExtrinsic<ApiTypes>;
    nonce: number;
};

export const JsonSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'string',
        },
        type: {
            type: 'array',
        },
        issuer: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                },
                name: {
                    type: 'string',
                },
                shard: {
                    type: 'string',
                },
            },
        },
        issuanceBlockNumber: {
            type: 'integer',
        },
        credentialSubject: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                },
                description: {
                    type: 'string',
                },
                type: {
                    type: 'string',
                },
                tag: {
                    type: 'array',
                },
                assertions: {
                    type: 'array',
                    items: {
                        type: 'object',
                    },
                },
                values: {
                    type: 'array',
                    items: {
                        type: 'boolean',
                    },
                },
                endpoint: {
                    type: 'string',
                },
            },
            required: ['id', 'description', 'type', 'assertions', 'values', 'endpoint'],
        },
        proof: {
            type: 'object',
            properties: {
                createdBlockNumber: {
                    type: 'integer',
                },
                type: {
                    enum: ['Ed25519Signature2020'],
                },
                proofPurpose: {
                    enum: ['assertionMethod'],
                },
                proofValue: {
                    type: 'string',
                },
                verificationMethod: {
                    type: 'string',
                },
            },
        },
    },
    required: ['id', 'type', 'credentialSubject', 'issuer', 'issuanceBlockNumber', 'proof'],
};
