const fs = require('fs');
const Contract = require('truffle-contract');
const Web3 = require('web3');
const ChainOfCustodyArtifact = require('../build/contracts/ChainOfCustody.json');

const ChainOfCustody = Contract(ChainOfCustodyArtifact);
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')); // Update with your Ethereum node URL

ChainOfCustody.setProvider(web3.currentProvider);

async function verify() {
    try {
        console.log("Verifying the blockchain:");

        // Get the contract instance
        const contractInstance = await ChainOfCustody.deployed();

        // Get the number of blocks
        const blockCount = await contractInstance.getBlockCount();
        console.log("Transactions in blockchain:", blockCount.toNumber());

        let blockchainState = 'CLEAN';

        // Iterate through each block
        for (let i = 1; i < blockCount.toNumber(); i++) {
            // Check if the previousHash of the current block matches the calculated hash of the previous block
            if (blockchainState === 'CLEAN' && blockchainState[i].previousHash !== await contractInstance.getLatestBlockHash(i - 1)) {
                console.log(`Block ${i} has an issue.`);
                console.log("Bad block:", blockHashToString(blockchain[i].previousHash));
                console.log("Calculated hash:", blockHashToString(await contractInstance.getLatestBlockHash(i - 1)));
                console.log("Reason:", "PARENT_NOT_FOUND");

                // Update the blockchain state to ERROR
                blockchainState = 'ERROR';
                break;
            }

            // Check for duplicate parent blocks
            if (i > 1 && blockchain[i].previousHash === blockchain[i - 2].previousHash) {
                console.log(`Block ${i} has an issue.`);
                console.log("Bad block:", blockHashToString(blockchain[i].previousHash));
                console.log("Duplicate parent block:", blockHashToString(blockchain[i - 2].previousHash));
                console.log("Reason:", "DUPLICATE_PARENT");

                // Update the blockchain state to ERROR
                blockchainState = 'ERROR';
                break;
            }

            // Check if the block contents match the calculated hash
            const calculatedHash = calculateBlockHash(blockchain[i]);
            if (blockchain[i].previousHash !== calculatedHash) {
                console.log(`Block ${i} has an issue.`);
                console.log("Bad block:", blockHashToString(blockchain[i].previousHash));
                console.log("Calculated hash:", blockHashToString(calculatedHash));
                console.log("Reason:", "CONTENT_MISMATCH");

                // Update the blockchain state to ERROR
                blockchainState = 'ERROR';
                break;
            }

            // Check for item checked out or checked in after removal
            if (
                keccak256(abi.encodePacked(blockchain[i].state)) === keccak256(abi.encodePacked("CHECKEDOUT")) &&
                i < blockCount - 1
            ) {
                console.log(`Block ${i} has an issue.`);
                console.log("Bad block:", blockHashToString(blockchain[i].previousHash));
                console.log("Calculated hash:", blockHashToString(await contractInstance.getLatestBlockHash(i)));
                console.log("Reason:", "ITEM_CHECKED_OUT_OR_IN_AFTER_REMOVAL");

                // Update the blockchain state to ERROR
                blockchainState = 'ERROR';
                break;
            }
        }

        if (blockchainState === 'CLEAN') {
            console.log("State of blockchain: CLEAN");
        } else {
            console.log("State of blockchain: ERROR");
        }

        //console.log("Blockchain verification complete.");
    } catch (error) {
        console.error("Error during blockchain verification:", error);
    }
}

verify();

function bytesToHexString(bytes) {
    let hexString = '0x';
    for (let i = 0; i < bytes.length; i++) {
        const hex = bytes[i].toString(16);
        hexString += (hex.length === 1 ? '0' : '') + hex;
    }
    return hexString;
}

function blockHashToString(hash) {
    return bytesToHexString(hash);
}

function calculateBlockHash(blockData) {
    return web3.utils.soliditySha3(
        { t: 'bytes32', v: blockData.previousHash },
        { t: 'uint64', v: blockData.timestamp },
        { t: 'uint128', v: blockData.caseId },
        { t: 'uint32', v: blockData.evidenceItemId },
        { t: 'string', v: blockData.state },
        { t: 'string', v: blockData.handlerName },
        { t: 'string', v: blockData.organizationName },
        { t: 'uint32', v: blockData.dataLength },
        { t: 'bytes', v: blockData.data }
    );
}
