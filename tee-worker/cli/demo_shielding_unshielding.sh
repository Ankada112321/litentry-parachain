#!/bin/bash

# to make sure the script aborts when (sub-)function exits abnormally
set -e

# Demonstrates how to shield tokens from the parentchain into the sidechain.
#
# setup:
# run all on localhost:
#   integritee-node purge-chain --dev
#   integritee-node --dev -lruntime=debug
#   rm light_client_db.bin
#   export RUST_LOG=integritee_service=info,ita_stf=debug
#   integritee-service init_shard
#   integritee-service shielding-key
#   integritee-service signing-key
#   integritee-service run
#
# then run this script

# usage:
#  demo_shielding_unshielding.sh -p <NODEPORT> -P <WORKERPORT> -t <TEST_BALANCE_RUN> -m file
#
# TEST_BALANCE_RUN is either "first" or "second"
# if -m file is set, the mrenclave will be read from file

while getopts ":m:p:P:t:u:V:C:" opt; do
    case $opt in
        t)
            TEST=$OPTARG
            ;;
        m)
            READMRENCLAVE=$OPTARG
            ;;
        p)
            NPORT=$OPTARG
            ;;
        P)
            WORKER1PORT=$OPTARG
            ;;
        u)
            NODEURL=$OPTARG
            ;;
        V)
            WORKER1URL=$OPTARG
            ;;
        C)
            CLIENT_BIN=$OPTARG
            ;;
    esac
done

# Using default port if none given as arguments.
NPORT=${NPORT:-9944}
NODEURL=${NODEURL:-"ws://127.0.0.1"}

WORKER1PORT=${WORKER1PORT:-2000}
WORKER1URL=${WORKER1URL:-"wss://127.0.0.1"}

CLIENT_BIN=${CLIENT_BIN:-"./../bin/integritee-cli"}

echo "Using client binary ${CLIENT_BIN}"
echo "Using node uri ${NODEURL}:${NPORT}"
echo "Using trusted-worker uri ${WORKER1URL}:${WORKER1PORT}"
echo ""

# the parentchain token is 12 decimal
UNIT=$(( 10 ** 12 ))

# we have to make these amounts greater than ED, see
# https://github.com/litentry/litentry-parachain/issues/1162
AMOUNT_SHIELD=$(( 6 * UNIT ))
AMOUNT_TRANSFER=$(( 2 * UNIT ))
AMOUNT_UNSHIELD=$(( 1 * UNIT ))

CLIENT="${CLIENT_BIN} -p ${NPORT} -P ${WORKER1PORT} -u ${NODEURL} -U ${WORKER1URL}"

# interval and max rounds to wait to check the given account balance in sidechain
WAIT_INTERVAL_SECONDS=10
WAIT_ROUNDS=20

# Poll until the given account's state is equal to expected, with timeout WAIT_INTERVAL_SECONDS * WAIT_ROUNDS
# usage:
#   poll_account_state <mrenclave> <account-pub-key> <jq-filter> <expected-state>
function poll_account_state()
{
    for i in $(seq 1 $WAIT_ROUNDS); do
        state=$(${CLIENT} trusted --mrenclave "$1" get-storage System Account "$2" | jq "$3")
        if [ $state -eq "$4" ]; then
            return
        else
            sleep $WAIT_INTERVAL_SECONDS
        fi
    done
    echo
    echo "Assert $2 $3 failed, expected = $4, actual = $state"
    exit 1
}

# Do a live query and assert the given account's state is equal to expected
# usage:
#   assert_account_state <mrenclave> <account-pub-key> <jq-filter> <expected-state>
function assert_account_state()
{
    state=$(${CLIENT} trusted --mrenclave "$1" get-storage System Account "$2" | jq "$3")
    if [ -z "$state" ]; then
        echo "Query Account $2 $3 failed"
        exit 1
    fi

    if [ $state -eq "$4" ]; then
        return
    fi
    echo
    echo "Assert $2 $3 failed, expected = $4, actual = $state"
    exit 1

}

echo "* Query on-chain enclave registry:"
WORKERS=$($CLIENT list-workers)
echo "WORKERS: "
echo "${WORKERS}"
echo ""

if [ "$READMRENCLAVE" = "file" ]
then
    read MRENCLAVE <<< $(cat ~/mrenclave.b58)
    echo "Reading MRENCLAVE from file: ${MRENCLAVE}"
else
    # this will always take the first MRENCLAVE found in the registry !!
    read MRENCLAVE <<< $(echo "$WORKERS" | awk '/  MRENCLAVE: / { print $2; exit }')
    echo "Reading MRENCLAVE from worker list: ${MRENCLAVE}"
fi
[[ -z $MRENCLAVE ]] && { echo "MRENCLAVE is empty. cannot continue" ; exit 1; }

echo "* Create a new incognito account for Alice"
ICGACCOUNTALICE=//AliceIncognito
ICGACCOUNTALICE_PUBKEY=0x50503350955afe8a107d6f115dc253eb5d75a3fe37a90b373db26cc12e3c6661
echo "  Alice's incognito account = ${ICGACCOUNTALICE}"
echo ""

# Asssert the initial balance of Alice incognito
# We create different (new) accounts for Bob incognito, hence his initial balance is always 0
BALANCE_INCOGNITO_ALICE=0
case $TEST in
    first)
        poll_account_state ${MRENCLAVE} ${ICGACCOUNTALICE_PUBKEY} ".data.free" 0
        ICGACCOUNTBOB=//BobIncognitoFirst
        ICGACCOUNTBOB_PUBKEY=0xf073e0349517dcd85f4058d22d8bf585e3027b0d9826a4e2294c407aa55b7605 ;;
    second)
        poll_account_state ${MRENCLAVE} ${ICGACCOUNTALICE_PUBKEY} ".data.free" $(( AMOUNT_SHIELD - AMOUNT_TRANSFER - AMOUNT_UNSHIELD ))
        BALANCE_INCOGNITO_ALICE=$(( AMOUNT_SHIELD - AMOUNT_TRANSFER - AMOUNT_UNSHIELD ))
        ICGACCOUNTBOB=//BobIncognitoSecond
        ICGACCOUNTBOB_PUBKEY=0x061d0c6eb3e940c885626236050a469eb2d44222f17d80e38d72a9379a073f46 ;;
    *)
        echo "unsupported test mode"
        exit 1 ;;
esac

echo "* Create a new incognito account for Bob"
echo "  Bob's incognito account = ${ICGACCOUNTBOB}"
echo ""

echo "* Shield ${AMOUNT_SHIELD} tokens to Alice's incognito account"
${CLIENT} shield-funds //Alice ${ICGACCOUNTALICE} ${AMOUNT_SHIELD} ${MRENCLAVE}
echo ""

echo "* Wait and assert Alice's incognito account balance... "
poll_account_state ${MRENCLAVE} ${ICGACCOUNTALICE_PUBKEY} ".data.free" $(( BALANCE_INCOGNITO_ALICE + AMOUNT_SHIELD ))
echo "✔ ok"

echo "* Wait and assert Bob's incognito account balance... "
poll_account_state ${MRENCLAVE} ${ICGACCOUNTBOB_PUBKEY} ".data.free" 0
echo "✔ ok"
echo ""

echo "* Send ${AMOUNT_TRANSFER} funds from Alice's incognito account to Bob's incognito account"
$CLIENT trusted --mrenclave ${MRENCLAVE} transfer ${ICGACCOUNTALICE} ${ICGACCOUNTBOB} ${AMOUNT_TRANSFER}
echo ""

echo "* Wait and assert Alice's incognito account balance... "
poll_account_state ${MRENCLAVE} ${ICGACCOUNTALICE_PUBKEY} ".data.free" $(( BALANCE_INCOGNITO_ALICE + AMOUNT_SHIELD - AMOUNT_TRANSFER ))
echo "✔ ok"

echo "* Wait and assert Bob's incognito account balance... "
poll_account_state ${MRENCLAVE} ${ICGACCOUNTBOB_PUBKEY} ".data.free" ${AMOUNT_TRANSFER}
echo "✔ ok"
echo ""

echo "* Un-shield ${AMOUNT_UNSHIELD} tokens from Alice's incognito account"
${CLIENT} trusted --mrenclave ${MRENCLAVE} --xt-signer //Alice unshield-funds ${ICGACCOUNTALICE} //Alice ${AMOUNT_UNSHIELD}
echo ""

echo "* Wait and assert Alice's incognito account balance... "
poll_account_state ${MRENCLAVE} ${ICGACCOUNTALICE_PUBKEY} ".data.free" $(( BALANCE_INCOGNITO_ALICE + AMOUNT_SHIELD - AMOUNT_TRANSFER - AMOUNT_UNSHIELD ))
echo "✔ ok"

echo "* Wait and assert Bob's incognito account balance... "
poll_account_state ${MRENCLAVE} ${ICGACCOUNTBOB_PUBKEY} ".data.free" ${AMOUNT_TRANSFER}
echo "✔ ok"

# Test the nonce handling, using Bob's incognito account as the sender as Alice's
# balance needs to be verified in the second round while Bob is newly created each time

echo "* Create a new incognito account for Charlie"
ICGACCOUNTCHARLIE=$(${CLIENT} trusted --mrenclave ${MRENCLAVE} new-account)
echo "  Charlie's incognito account = ${ICGACCOUNTCHARLIE}"
echo ""

echo "* Assert Bob's incognito initial nonce..."
assert_account_state ${MRENCLAVE} ${ICGACCOUNTBOB_PUBKEY} ".nonce" 0
echo "✔ ok"
echo ""

echo "* Send 3 consecutive 0.2 UNIT balance Transfer Bob -> Charlie"
for i in $(seq 1 3); do
    # use direct calls so they are submitted to the top pool synchronously
    $CLIENT trusted --direct --mrenclave ${MRENCLAVE} transfer ${ICGACCOUNTBOB} ${ICGACCOUNTCHARLIE} $(( AMOUNT_TRANSFER / 10 ))
done
echo ""

echo "* Assert Bob's incognito current nonce..."
poll_account_state ${MRENCLAVE} ${ICGACCOUNTBOB_PUBKEY} ".nonce" 3
echo "✔ ok"
echo ""

echo "* Send a 2 UNIT balance Transfer Bob -> Charlie (that will fail)"
$CLIENT trusted --direct --mrenclave ${MRENCLAVE} transfer ${ICGACCOUNTBOB} ${ICGACCOUNTCHARLIE} ${AMOUNT_TRANSFER}
echo ""

echo "* Assert Bob's incognito nonce..."
# the nonce should be increased nontheless, even for the failed tx
poll_account_state ${MRENCLAVE} ${ICGACCOUNTBOB_PUBKEY} ".nonce" 4
echo "✔ ok"
echo ""

echo "* Send another 0.2 UNIT balance Transfer Bob -> Charlie"
$CLIENT trusted --direct --mrenclave ${MRENCLAVE} transfer ${ICGACCOUNTBOB} ${ICGACCOUNTCHARLIE} $(( AMOUNT_TRANSFER / 10 ))
echo ""

echo "* Assert Bob's incognito nonce..."
poll_account_state ${MRENCLAVE} ${ICGACCOUNTBOB_PUBKEY} ".nonce" 5
echo "✔ ok"
echo ""

echo "* Wait and assert Bob's incognito account balance... "
# in total 4 balance transfer should go through => 1.2 UNIT remaining
poll_account_state ${MRENCLAVE} ${ICGACCOUNTBOB_PUBKEY} ".data.free" $(( AMOUNT_TRANSFER * 6 / 10 ))
echo "✔ ok"

echo ""
echo "-----------------------"
echo "✔ The $TEST test passed!"
echo "-----------------------"
echo ""
