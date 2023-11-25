const Web3 = require('web3');
const contractABI = require('../build/contracts/ChainOfCustody.json');
const contractConfig = require('../build/contracts/ChainOfCustody.json');
const contractAddress = contractConfig.contractAddress;

const web3 = new Web3('http://127.0.0.1:7545');
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

async function checkoutEvidenceItem(evidenceItemId) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    try {
        let result = await contract.methods.checkoutEvidenceItem(evidenceItemId).send({ from: account });
        let receipt = await web3.eth.getTransactionReceipt(result.transactionHash);

        if (receipt && receipt.logs) {
            receipt.logs.forEach((log) => {
                let event = web3.eth.abi.decodeLog([
                    { type: 'uint128', name: 'caseId', indexed: true },
                    { type: 'uint32', name: 'evidenceItemId', indexed: true },
                    { type: 'uint64', name: 'timestamp' },
                    { type: 'bytes12', name: 'state' }
                ], log.data, log.topics.slice(1));

                console.log(`Checked out item: ${evidenceItemId}`);
                console.log(`Case ID: ${event.caseId}`);
                console.log(`Status: ${web3.utils.hexToAscii(event.state)}`);
                console.log(`Time of action: ${new Date(event.timestamp * 1000).toISOString()}`);
            });
        }
    } catch (error) {
        console.error('Error during checkout:', error.message);
    }
}

const evidenceItemId = process.argv[2]; // Accept evidence item ID from command line
checkoutEvidenceItem(evidenceItemId).then(() => process.exit(0));
