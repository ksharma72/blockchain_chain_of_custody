const Web3 = require('web3');
const Contract = require('truffle-contract');
const ChainOfCustodyArtifact = require('../build/contracts/ChainOfCustody.json');

const ChainOfCustody = Contract(ChainOfCustodyArtifact);
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));

ChainOfCustody.setProvider(web3.currentProvider);

async function verify() {
    try {
        console.log("Verifying the blockchain:");

        // Get the contract instance
        const contractInstance = await ChainOfCustody.deployed();

        // Verify the blockchain
        const verificationResult = await contractInstance.verifyBlockchain();
        console.log("Blockchain verification result:", verificationResult);

        if (verificationResult === 'ERROR') {
            const badBlockInfo = await contractInstance.getBadBlockInfo();
            console.log("Bad Block Information:", badBlockInfo);
        } else {
            console.log("State of blockchain: CLEAN");
        }
    } catch (error) {
        console.error("Error during blockchain verification:", error);
    }
}

verify();
