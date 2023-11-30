<<<<<<< HEAD
const Web3 = require('web3');
const contractABI = require('../build/contracts/ChainOfCustody.json');

// Setup Web3 and contract instance
const networkId = '5777';
const contractData = contractABI.networks[networkId];
const contractAddress = contractData.address;
const web3 = new Web3('http://127.0.0.1:7545');
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

async function verifyBlockchain() {
    try {
        // Fetch the entire blockchain
        const blockchain = await contract.methods.getBlockchain().call();

        if (blockchain.length === 0) {
            console.log("Transactions in blockchain: 0\nState of blockchain: EMPTY");
            return;
        }

        // Verify the integrity of the blockchain
        for (let i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const previousBlock = blockchain[i - 1];

            // Check proper linking of blocks (hash comparison)
            const calculatedHash = calculateHash(previousBlock);
            if (currentBlock.previousHash !== calculatedHash) {
                console.log(`Transactions in blockchain: ${blockchain.length}\nState of blockchain: ERROR\nBad block: ${currentBlock.hash}\nParent block: ${previousBlock.hash || 'NOT FOUND'}`);
                return;
            }

            // Additional checks can be added here
        }

        console.log(`Transactions in blockchain: ${blockchain.length}\nState of blockchain: CLEAN`);
    } catch (error) {
        console.error('Error verifying blockchain:', error.message);
    }
}

function calculateHash(block) {
    // Implement the same hashing logic as in your Solidity contract
    return Web3.utils.soliditySha3(
        { t: 'bytes32', v: block.previousHash },
        { t: 'uint64', v: block.timestamp },
        // ... other fields
    );
}

verifyBlockchain().then(() => process.exit(0));

=======
const fs = require('fs'); // Added to include the 'fs' module for file system operations
const { execSync } = require('child_process'); // Added to include the 'execSync' function
const Contract = require('truffle-contract');
const Web3 = require('web3');
const ChainOfCustodyArtifact = require('../build/contracts/ChainOfCustody.json'); // Adjust the path accordingly

const ChainOfCustody = Contract(ChainOfCustodyArtifact);
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // Update with your Ethereum node URL

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
>>>>>>> 70e04fe5a7f85ecb76277e3bcbaebf1a88493edf
