const fs = require('fs');
const Contract = require('truffle-contract');
const Web3 = require('web3');
const ChainOfCustodyArtifact = require('../build/contracts/ChainOfCustody.json'); // Adjust the path accordingly

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
        for (let i = 0; i < blockCount.toNumber(); i++) {
            console.log(`Checking block ${i}...`); // Log which block is being checked

            const block = await contractInstance.getBlock(i);

            // Add your custom logic to check for issues in each block
            if (block.someCondition) {
                console.log(`Block ${i} has an issue.`);

                // Log information about the bad block
                console.log("Bad block:", block.blockHash);
                console.log("Reason:", "Some custom reason for the error");

                // Update the blockchain state to ERROR
                blockchainState = 'ERROR';
            } else {
                console.log(`Block ${i} is clean.`);
            }
        }

        if (blockchainState === 'CLEAN') {
            console.log("State of blockchain: CLEAN");
        } else {
            console.log("State of blockchain: ERROR");
        }

        console.log("Blockchain verification complete.");
    } catch (error) {
        console.error("Error during blockchain verification:", error);
    }
}

verify();
