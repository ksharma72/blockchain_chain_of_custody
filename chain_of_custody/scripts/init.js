const fs = require('fs'); // Added to include the 'fs' module for file system operations
const { execSync } = require('child_process'); // Added to include the 'execSync' function
const Contract = require('truffle-contract');
const Web3 = require('web3');
const ChainOfCustodyArtifact = require('../build/contracts/ChainOfCustody.json'); // Adjust the path accordingly

const ChainOfCustody = Contract(ChainOfCustodyArtifact);
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')); // Update with your Ethereum node URL

ChainOfCustody.setProvider(web3.currentProvider);

async function init() {
    try {
        console.log("Script started.");

        // Check if the blockchain file exists
        const blockchainFileExists = fs.existsSync('ChainOfCustody.json'); // Adjusted file name to match the import

        if (!blockchainFileExists) {
            console.log("Blockchain file not found. Creating INITIAL block.");

            // Run Truffle migration
            execSync('truffle migrate');

            console.log("Truffle migration complete.");

            // Additional initialization logic for creating the initial block
            const contractInstance = await ChainOfCustody.deployed();
            const initialData = "Initial data for the genesis block";

            // You may have a function in your smart contract to add the initial block
            await contractInstance.addBlock(initialData);

            console.log("INITIAL block created.");
        } else {
            console.log("Blockchain file found.");
        }

        console.log("Script completed.");
    } catch (error) {
        console.error("Error during initialization:", error);
    }
}

init();
