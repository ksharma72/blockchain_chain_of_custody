const Web3 = require('web3');
const contractABI = require('../build/contracts/ChainOfCustody.json');

// Assuming you are using Ganache, which typically uses network ID '5777'
const networkId = '5777';
const contractData = contractABI.networks[networkId];

if (!contractData || !contractData.address) {
    console.error("Contract not deployed on the current network (network ID: " + networkId + ")");
    process.exit(1);
}

const contractAddress = contractData.address;

const web3 = new Web3('http://127.0.0.1:7545');
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

async function showItemHistory(itemId) {
    try {
        let history = await contract.methods.getItemHistory(itemId).call();
        history.sort((a, b) => a.timestamp - b.timestamp); // Sort by timestamp for chronological order

        console.log(`History for item ${itemId}:`);
        history.forEach(entry => {
            console.log(`Case: ${entry.caseId}`);
            console.log(`Item: ${entry.evidenceItemId}`);
            console.log(`Action: ${entry.state}`);
            console.log(`Time: ${new Date(entry.timestamp * 1000).toISOString()}`);
        });
    } catch (error) {
        console.error("Error fetching item history:", error);
    }
}

const itemId = process.argv[2]; // Accepting item ID from command line
showItemHistory(itemId);
