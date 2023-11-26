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
const web3 = new Web3('http://127.0.0.1:7545'); // Replace with your Ethereum client URL
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

async function showCases() {
    try {
        let caseIds = await contract.methods.getCases().call();
        console.log("Cases:");
        caseIds.forEach(caseId => {
            console.log(caseId); // Printing the caseID
        });
    } catch (error) {
        console.error("Error fetching cases:", error);
    }
}

showCases();
