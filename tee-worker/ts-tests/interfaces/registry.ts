// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/types/registry';

import type {
    ClaimsPrimitivesEcdsaSignature,
    ClaimsPrimitivesEthereumAddress,
    ClaimsPrimitivesStatementKind,
    CorePrimitivesAssertion,
    CorePrimitivesAssertionIndexingNetwork,
    CorePrimitivesErrorErrorDetail,
    CorePrimitivesErrorImpError,
    CorePrimitivesErrorVcmpError,
    CorePrimitivesKeyAesOutput,
    FinalityGrandpaEquivocationPrecommit,
    FinalityGrandpaEquivocationPrevote,
    FinalityGrandpaPrecommit,
    FinalityGrandpaPrevote,
    FrameSupportDispatchDispatchClass,
    FrameSupportDispatchDispatchInfo,
    FrameSupportDispatchPays,
    FrameSupportDispatchPerDispatchClassU32,
    FrameSupportDispatchPerDispatchClassWeight,
    FrameSupportDispatchPerDispatchClassWeightsPerClass,
    FrameSupportDispatchRawOrigin,
    FrameSupportPalletId,
    FrameSupportPreimagesBounded,
    FrameSupportTokensMiscBalanceStatus,
    FrameSystemAccountInfo,
    FrameSystemCall,
    FrameSystemError,
    FrameSystemEvent,
    FrameSystemEventRecord,
    FrameSystemExtensionsCheckGenesis,
    FrameSystemExtensionsCheckNonZeroSender,
    FrameSystemExtensionsCheckNonce,
    FrameSystemExtensionsCheckSpecVersion,
    FrameSystemExtensionsCheckTxVersion,
    FrameSystemExtensionsCheckWeight,
    FrameSystemLastRuntimeUpgradeInfo,
    FrameSystemLimitsBlockLength,
    FrameSystemLimitsBlockWeights,
    FrameSystemLimitsWeightsPerClass,
    FrameSystemPhase,
    IntegriteeNodeRuntimeOriginCaller,
    IntegriteeNodeRuntimeProxyType,
    IntegriteeNodeRuntimeRuntime,
    PalletBalancesAccountData,
    PalletBalancesBalanceLock,
    PalletBalancesCall,
    PalletBalancesError,
    PalletBalancesEvent,
    PalletBalancesReasons,
    PalletBalancesReserveData,
    PalletClaimsCall,
    PalletClaimsError,
    PalletClaimsEvent,
    PalletCollectiveCall,
    PalletCollectiveError,
    PalletCollectiveEvent,
    PalletCollectiveRawOrigin,
    PalletCollectiveVotes,
    PalletGrandpaCall,
    PalletGrandpaError,
    PalletGrandpaEvent,
    PalletGrandpaStoredPendingChange,
    PalletGrandpaStoredState,
    PalletGroupCall,
    PalletGroupError,
    PalletGroupEvent,
    PalletIdentityManagementCall,
    PalletIdentityManagementError,
    PalletIdentityManagementEvent,
    PalletMultisigCall,
    PalletMultisigError,
    PalletMultisigEvent,
    PalletMultisigMultisig,
    PalletMultisigTimepoint,
    PalletPreimageCall,
    PalletPreimageError,
    PalletPreimageEvent,
    PalletPreimageRequestStatus,
    PalletProxyAnnouncement,
    PalletProxyCall,
    PalletProxyError,
    PalletProxyEvent,
    PalletProxyProxyDefinition,
    PalletSchedulerCall,
    PalletSchedulerError,
    PalletSchedulerEvent,
    PalletSchedulerScheduled,
    PalletSidechainCall,
    PalletSidechainError,
    PalletSidechainEvent,
    PalletSudoCall,
    PalletSudoError,
    PalletSudoEvent,
    PalletTeeracleCall,
    PalletTeeracleError,
    PalletTeeracleEvent,
    PalletTeerexCall,
    PalletTeerexError,
    PalletTeerexEvent,
    PalletTimestampCall,
    PalletTransactionPaymentChargeTransactionPayment,
    PalletTransactionPaymentEvent,
    PalletTransactionPaymentReleases,
    PalletTreasuryCall,
    PalletTreasuryError,
    PalletTreasuryEvent,
    PalletTreasuryProposal,
    PalletUtilityCall,
    PalletUtilityError,
    PalletUtilityEvent,
    PalletVcManagementCall,
    PalletVcManagementError,
    PalletVcManagementEvent,
    PalletVcManagementSchemaVcSchema,
    PalletVcManagementVcContext,
    PalletVcManagementVcContextStatus,
    PalletVestingCall,
    PalletVestingError,
    PalletVestingEvent,
    PalletVestingReleases,
    PalletVestingVestingInfo,
    SidechainPrimitivesSidechainBlockConfirmation,
    SpArithmeticArithmeticError,
    SpCoreEcdsaSignature,
    SpCoreEd25519Public,
    SpCoreEd25519Signature,
    SpCoreSr25519Signature,
    SpCoreVoid,
    SpFinalityGrandpaAppPublic,
    SpFinalityGrandpaAppSignature,
    SpFinalityGrandpaEquivocation,
    SpFinalityGrandpaEquivocationProof,
    SpRuntimeDigest,
    SpRuntimeDigestDigestItem,
    SpRuntimeDispatchError,
    SpRuntimeModuleError,
    SpRuntimeMultiSignature,
    SpRuntimeTokenError,
    SpRuntimeTransactionalError,
    SpVersionRuntimeVersion,
    SpWeightsRuntimeDbWeight,
    SpWeightsWeightV2Weight,
    SubstrateFixedFixedU64,
    TeerexPrimitivesEnclave,
    TeerexPrimitivesQeTcb,
    TeerexPrimitivesQuotingEnclave,
    TeerexPrimitivesRequest,
    TeerexPrimitivesSgxBuildMode,
    TeerexPrimitivesSgxEnclaveMetadata,
    TeerexPrimitivesTcbInfoOnChain,
    TeerexPrimitivesTcbVersionStatus,
    TypenumBitB0,
    TypenumBitB1,
    TypenumUIntUInt,
    TypenumUIntUTerm,
    TypenumUintUTerm,
} from '@polkadot/types/lookup';

declare module '@polkadot/types/types/registry' {
    interface InterfaceTypes {
        ClaimsPrimitivesEcdsaSignature: ClaimsPrimitivesEcdsaSignature;
        ClaimsPrimitivesEthereumAddress: ClaimsPrimitivesEthereumAddress;
        ClaimsPrimitivesStatementKind: ClaimsPrimitivesStatementKind;
        CorePrimitivesAssertion: CorePrimitivesAssertion;
        CorePrimitivesAssertionIndexingNetwork: CorePrimitivesAssertionIndexingNetwork;
        CorePrimitivesErrorErrorDetail: CorePrimitivesErrorErrorDetail;
        CorePrimitivesErrorImpError: CorePrimitivesErrorImpError;
        CorePrimitivesErrorVcmpError: CorePrimitivesErrorVcmpError;
        CorePrimitivesKeyAesOutput: CorePrimitivesKeyAesOutput;
        FinalityGrandpaEquivocationPrecommit: FinalityGrandpaEquivocationPrecommit;
        FinalityGrandpaEquivocationPrevote: FinalityGrandpaEquivocationPrevote;
        FinalityGrandpaPrecommit: FinalityGrandpaPrecommit;
        FinalityGrandpaPrevote: FinalityGrandpaPrevote;
        FrameSupportDispatchDispatchClass: FrameSupportDispatchDispatchClass;
        FrameSupportDispatchDispatchInfo: FrameSupportDispatchDispatchInfo;
        FrameSupportDispatchPays: FrameSupportDispatchPays;
        FrameSupportDispatchPerDispatchClassU32: FrameSupportDispatchPerDispatchClassU32;
        FrameSupportDispatchPerDispatchClassWeight: FrameSupportDispatchPerDispatchClassWeight;
        FrameSupportDispatchPerDispatchClassWeightsPerClass: FrameSupportDispatchPerDispatchClassWeightsPerClass;
        FrameSupportDispatchRawOrigin: FrameSupportDispatchRawOrigin;
        FrameSupportPalletId: FrameSupportPalletId;
        FrameSupportPreimagesBounded: FrameSupportPreimagesBounded;
        FrameSupportTokensMiscBalanceStatus: FrameSupportTokensMiscBalanceStatus;
        FrameSystemAccountInfo: FrameSystemAccountInfo;
        FrameSystemCall: FrameSystemCall;
        FrameSystemError: FrameSystemError;
        FrameSystemEvent: FrameSystemEvent;
        FrameSystemEventRecord: FrameSystemEventRecord;
        FrameSystemExtensionsCheckGenesis: FrameSystemExtensionsCheckGenesis;
        FrameSystemExtensionsCheckNonZeroSender: FrameSystemExtensionsCheckNonZeroSender;
        FrameSystemExtensionsCheckNonce: FrameSystemExtensionsCheckNonce;
        FrameSystemExtensionsCheckSpecVersion: FrameSystemExtensionsCheckSpecVersion;
        FrameSystemExtensionsCheckTxVersion: FrameSystemExtensionsCheckTxVersion;
        FrameSystemExtensionsCheckWeight: FrameSystemExtensionsCheckWeight;
        FrameSystemLastRuntimeUpgradeInfo: FrameSystemLastRuntimeUpgradeInfo;
        FrameSystemLimitsBlockLength: FrameSystemLimitsBlockLength;
        FrameSystemLimitsBlockWeights: FrameSystemLimitsBlockWeights;
        FrameSystemLimitsWeightsPerClass: FrameSystemLimitsWeightsPerClass;
        FrameSystemPhase: FrameSystemPhase;
        IntegriteeNodeRuntimeOriginCaller: IntegriteeNodeRuntimeOriginCaller;
        IntegriteeNodeRuntimeProxyType: IntegriteeNodeRuntimeProxyType;
        IntegriteeNodeRuntimeRuntime: IntegriteeNodeRuntimeRuntime;
        PalletBalancesAccountData: PalletBalancesAccountData;
        PalletBalancesBalanceLock: PalletBalancesBalanceLock;
        PalletBalancesCall: PalletBalancesCall;
        PalletBalancesError: PalletBalancesError;
        PalletBalancesEvent: PalletBalancesEvent;
        PalletBalancesReasons: PalletBalancesReasons;
        PalletBalancesReserveData: PalletBalancesReserveData;
        PalletClaimsCall: PalletClaimsCall;
        PalletClaimsError: PalletClaimsError;
        PalletClaimsEvent: PalletClaimsEvent;
        PalletCollectiveCall: PalletCollectiveCall;
        PalletCollectiveError: PalletCollectiveError;
        PalletCollectiveEvent: PalletCollectiveEvent;
        PalletCollectiveRawOrigin: PalletCollectiveRawOrigin;
        PalletCollectiveVotes: PalletCollectiveVotes;
        PalletGrandpaCall: PalletGrandpaCall;
        PalletGrandpaError: PalletGrandpaError;
        PalletGrandpaEvent: PalletGrandpaEvent;
        PalletGrandpaStoredPendingChange: PalletGrandpaStoredPendingChange;
        PalletGrandpaStoredState: PalletGrandpaStoredState;
        PalletGroupCall: PalletGroupCall;
        PalletGroupError: PalletGroupError;
        PalletGroupEvent: PalletGroupEvent;
        PalletIdentityManagementCall: PalletIdentityManagementCall;
        PalletIdentityManagementError: PalletIdentityManagementError;
        PalletIdentityManagementEvent: PalletIdentityManagementEvent;
        PalletMultisigCall: PalletMultisigCall;
        PalletMultisigError: PalletMultisigError;
        PalletMultisigEvent: PalletMultisigEvent;
        PalletMultisigMultisig: PalletMultisigMultisig;
        PalletMultisigTimepoint: PalletMultisigTimepoint;
        PalletPreimageCall: PalletPreimageCall;
        PalletPreimageError: PalletPreimageError;
        PalletPreimageEvent: PalletPreimageEvent;
        PalletPreimageRequestStatus: PalletPreimageRequestStatus;
        PalletProxyAnnouncement: PalletProxyAnnouncement;
        PalletProxyCall: PalletProxyCall;
        PalletProxyError: PalletProxyError;
        PalletProxyEvent: PalletProxyEvent;
        PalletProxyProxyDefinition: PalletProxyProxyDefinition;
        PalletSchedulerCall: PalletSchedulerCall;
        PalletSchedulerError: PalletSchedulerError;
        PalletSchedulerEvent: PalletSchedulerEvent;
        PalletSchedulerScheduled: PalletSchedulerScheduled;
        PalletSidechainCall: PalletSidechainCall;
        PalletSidechainError: PalletSidechainError;
        PalletSidechainEvent: PalletSidechainEvent;
        PalletSudoCall: PalletSudoCall;
        PalletSudoError: PalletSudoError;
        PalletSudoEvent: PalletSudoEvent;
        PalletTeeracleCall: PalletTeeracleCall;
        PalletTeeracleError: PalletTeeracleError;
        PalletTeeracleEvent: PalletTeeracleEvent;
        PalletTeerexCall: PalletTeerexCall;
        PalletTeerexError: PalletTeerexError;
        PalletTeerexEvent: PalletTeerexEvent;
        PalletTimestampCall: PalletTimestampCall;
        PalletTransactionPaymentChargeTransactionPayment: PalletTransactionPaymentChargeTransactionPayment;
        PalletTransactionPaymentEvent: PalletTransactionPaymentEvent;
        PalletTransactionPaymentReleases: PalletTransactionPaymentReleases;
        PalletTreasuryCall: PalletTreasuryCall;
        PalletTreasuryError: PalletTreasuryError;
        PalletTreasuryEvent: PalletTreasuryEvent;
        PalletTreasuryProposal: PalletTreasuryProposal;
        PalletUtilityCall: PalletUtilityCall;
        PalletUtilityError: PalletUtilityError;
        PalletUtilityEvent: PalletUtilityEvent;
        PalletVcManagementCall: PalletVcManagementCall;
        PalletVcManagementError: PalletVcManagementError;
        PalletVcManagementEvent: PalletVcManagementEvent;
        PalletVcManagementSchemaVcSchema: PalletVcManagementSchemaVcSchema;
        PalletVcManagementVcContext: PalletVcManagementVcContext;
        PalletVcManagementVcContextStatus: PalletVcManagementVcContextStatus;
        PalletVestingCall: PalletVestingCall;
        PalletVestingError: PalletVestingError;
        PalletVestingEvent: PalletVestingEvent;
        PalletVestingReleases: PalletVestingReleases;
        PalletVestingVestingInfo: PalletVestingVestingInfo;
        SidechainPrimitivesSidechainBlockConfirmation: SidechainPrimitivesSidechainBlockConfirmation;
        SpArithmeticArithmeticError: SpArithmeticArithmeticError;
        SpCoreEcdsaSignature: SpCoreEcdsaSignature;
        SpCoreEd25519Public: SpCoreEd25519Public;
        SpCoreEd25519Signature: SpCoreEd25519Signature;
        SpCoreSr25519Signature: SpCoreSr25519Signature;
        SpCoreVoid: SpCoreVoid;
        SpFinalityGrandpaAppPublic: SpFinalityGrandpaAppPublic;
        SpFinalityGrandpaAppSignature: SpFinalityGrandpaAppSignature;
        SpFinalityGrandpaEquivocation: SpFinalityGrandpaEquivocation;
        SpFinalityGrandpaEquivocationProof: SpFinalityGrandpaEquivocationProof;
        SpRuntimeDigest: SpRuntimeDigest;
        SpRuntimeDigestDigestItem: SpRuntimeDigestDigestItem;
        SpRuntimeDispatchError: SpRuntimeDispatchError;
        SpRuntimeModuleError: SpRuntimeModuleError;
        SpRuntimeMultiSignature: SpRuntimeMultiSignature;
        SpRuntimeTokenError: SpRuntimeTokenError;
        SpRuntimeTransactionalError: SpRuntimeTransactionalError;
        SpVersionRuntimeVersion: SpVersionRuntimeVersion;
        SpWeightsRuntimeDbWeight: SpWeightsRuntimeDbWeight;
        SpWeightsWeightV2Weight: SpWeightsWeightV2Weight;
        SubstrateFixedFixedU64: SubstrateFixedFixedU64;
        TeerexPrimitivesEnclave: TeerexPrimitivesEnclave;
        TeerexPrimitivesQeTcb: TeerexPrimitivesQeTcb;
        TeerexPrimitivesQuotingEnclave: TeerexPrimitivesQuotingEnclave;
        TeerexPrimitivesRequest: TeerexPrimitivesRequest;
        TeerexPrimitivesSgxBuildMode: TeerexPrimitivesSgxBuildMode;
        TeerexPrimitivesSgxEnclaveMetadata: TeerexPrimitivesSgxEnclaveMetadata;
        TeerexPrimitivesTcbInfoOnChain: TeerexPrimitivesTcbInfoOnChain;
        TeerexPrimitivesTcbVersionStatus: TeerexPrimitivesTcbVersionStatus;
        TypenumBitB0: TypenumBitB0;
        TypenumBitB1: TypenumBitB1;
        TypenumUIntUInt: TypenumUIntUInt;
        TypenumUIntUTerm: TypenumUIntUTerm;
        TypenumUintUTerm: TypenumUintUTerm;
    } // InterfaceTypes
} // declare module
