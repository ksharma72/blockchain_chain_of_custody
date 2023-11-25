const Web3 = require('web3');
const contractABI = require('../build/contracts/ChainOfCustody.json');
const contractConfig = require('../build/contracts/ChainOfCustody.json');
const contractAddress = contractConfig.contractAddress;

// Create a web3 instance with the URL of your Ethereum node
const web3 = new Web3('http://localhost:7545');

const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

async function addEvidenceItems(caseId, itemIds) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0]; // Using the first account for transactions

    try {
        let result = await contract.methods.addEvidenceItems(caseId, itemIds).send({ from: account });
        let receipt = await web3.eth.getTransactionReceipt(result.transactionHash);

        if (receipt && receipt.logs) {
            receipt.logs.forEach((log) => {
                // Adjusted to handle indexed parameters correctly
                let event = web3.eth.abi.decodeLog([
                    { type: 'uint64', name: 'timestamp' },
                    { type: 'bytes12', name: 'state' }
                ], log.data, log.topics.slice(1));  // Using slice(1) to skip the event signature hash

                // Extracting indexed parameters directly from log topics
                const caseId = web3.utils.toBN(log.topics[1]).toString();
                const evidenceItemId = web3.utils.toBN(log.topics[2]).toString();

                console.log("Evidence Item Added:");
                console.log("Case ID:", caseId);
                console.log("Item ID:", evidenceItemId);
                console.log("Timestamp:", new Date(event.timestamp * 1000).toISOString());
                console.log("State:", web3.utils.hexToAscii(event.state));
            });
        }
    } catch (error) {
        console.error('Error adding evidence items:', error);
    }
}

addEvidenceItems(caseId, itemIds);
