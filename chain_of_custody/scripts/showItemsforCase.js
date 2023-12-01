const Web3 = require('web3');
const contractABI = require('../build/contracts/ChainOfCustody.json');

const networkId = '5777';
const contractData = contractABI.networks[networkId];

if (!contractData || !contractData.address) {
    console.error("Contract not deployed on the current network (network ID: " + networkId + ")");
    process.exit(1);
}

const contractAddress = contractData.address;

// Create a web3 instance with the URL of your Ethereum node
const web3 = new Web3('http://127.0.0.1:7545');
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

async function showItemsForCase(caseId) {
    try {
        let itemIds = await contract.methods.getItemsForCase(caseId).call();
        //console.log(`Items for case ${caseId}:`);
        itemIds.forEach(itemId => {
            console.log(itemId.toString()); // Display each item ID
        });
    } catch (error) {
        console.error("Error fetching items for case:", error);
    }
}

// Accepting command line arguments
const caseId = process.argv[2];
showItemsForCase(caseId);
