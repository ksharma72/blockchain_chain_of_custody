const Web3 = require("web3");

const web3 = new Web3("http://127.0.0.1:7545"); // Update with your Ganache URL

// Replace the following with your actual contract address and ABI
const contractAddress = "0xc6515E4A0e6A0A6B383cDc7D2F5C86a45C5A206F";
const contractABI = require("C:\Users\ASUS\Dropbox (ASU)\MS ASU\CSE 469 CNF\GROUP PROJECT\kuchbi\blockchain_chain_of_custody\chain_of_custody\build\contracts\ChainOfCustody.json");

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function retrieveData() {
    try {
        // Example: Retrieve case ID
        const caseId = await contract.methods.getCaseId().call();
        console.log("Case ID:", caseId);

        // Example: Retrieve evidence ID
        const evidenceId = await contract.methods.getEvidenceId().call();
        console.log("Evidence ID:", evidenceId);

        // Add more calls as needed for other data

        console.log("Data retrieved successfully");
    } catch (error) {
        console.error("Error retrieving data:", error);
    }
}

retrieveData();
