const fs = require('fs');
const Contract = require('truffle-contract');
const Web3 = require('web3');
const ChainOfCustodyArtifact = require('../build/contracts/ChainOfCustody.json');

const ChainOfCustody = Contract(ChainOfCustodyArtifact);
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545')); // Update with your Ganache HTTP provider URL

ChainOfCustody.setProvider(web3.currentProvider);

// Function to get the contract address
function getContractAddress() {
    // Assuming you are using Ganache, which typically uses network ID '5777'
    const networkId = '5777';
    const contractData = ChainOfCustodyArtifact.networks[networkId];

    if (!contractData || !contractData.address) {
        console.error("Contract not deployed on the current network (network ID: " + networkId + ")");
        process.exit(1);
    }

    return contractData.address;
}

async function checkForBlocks() {
    try {
        const contractAddress = getContractAddress();
        const contractInstance = await ChainOfCustody.at(contractAddress);

        const numberOfBlocks = await contractInstance.getBlockCount();

        if (numberOfBlocks === 0) {
            console.log("No existing blocks found. Creating INITIAL block.");

            // Start Ganache with the specified port and network id
            console.log("Starting Ganache...");
            require('child_process').spawnSync('ganache-cli', ['-p', '7545', '-i', '5777']);

            // Wait for Ganache to start (you might need to adjust the delay based on your system)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Load the contract instance using the dynamically extracted contract address
            const newContractAddress = getContractAddress(); // You can reuse the function
            const newContractInstance = await ChainOfCustody.at(newContractAddress);

            // Additional initialization logic for creating the initial block
            const initialData = ["Initial data for the genesis block"];
            const itemIds = [1]; // Assuming the item ID for the initial block is 1

            // Set the "from" field with the default account
            const options = { from: web3.eth.defaultAccount };

            // Assuming 'addEvidenceItems' function updates the state and creates a new block in the blockchain
            await newContractInstance.addEvidenceItems(1, itemIds, 'HandlerName', 'OrganizationName', options);

            console.log(`INITIAL block created. Contract address: ${newContractAddress}`);
        } else {
            console.log("Blockchain file found with INITIAL block.");
        }

        //console.log("Script completed.");
    } catch (error) {
        console.error("Error checking for blocks:", error);
    }
}

checkForBlocks();
