const fs = require('fs');
const Contract = require('truffle-contract');
const Web3 = require('web3');
const ChainOfCustodyArtifact = require('../build/contracts/ChainOfCustody.json');
const { spawn } = require('child_process');

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

// Function to check if a port is open
async function isPortOpen(port) {
    return new Promise(resolve => {
        const net = require('net');
        const tester = net.createConnection(port);

        tester.once('error', () => {
            resolve(false);
        });

        tester.once('connect', () => {
            tester.end();
            resolve(true);
        });
    });
}

async function checkForBlocks() {
    try {
        const contractAddress = getContractAddress();

        // Check if Ganache is already running on port 7545
        const isGanacheRunning = await isPortOpen(7545);

        if (!isGanacheRunning) {
            console.log("Ganache not running. Starting Ganache...");

            // Start Ganache in a new terminal window
            spawn('ganache-cli', ['-p', '7545', '-i', '5777'], { shell: true, detached: true });

            // Wait for Ganache to start (you might need to adjust the delay based on your system)
            await new Promise(resolve => setTimeout(resolve, 5000));

            console.log("Ganache started successfully.");

            // Run Truffle migrate command
            console.log("Running Truffle migrate...");
            const truffleMigrate = spawn('truffle', ['migrate', '--reset'], { shell: true });
            truffleMigrate.on('exit', code => {
                if (code === 0) {
                    console.log("Truffle migrate completed successfully.");
                } else {
                    console.error("Truffle migrate failed. Please check the Truffle logs for details.");
                }
            });
        }

        const newContractInstance = await ChainOfCustody.at(contractAddress);

        const numberOfBlocks = await newContractInstance.getBlockCount();

        if (numberOfBlocks === 0) {
            console.log("No existing blocks found. Creating INITIAL block.");

            // Assuming 'addEvidenceItems' function updates the state and creates a new block in the blockchain
            const initialData = ["Initial data for the genesis block"];
            const itemIds = [1]; // Assuming the item ID for the initial block is 1

            // Set the "from" field with the default account
            const options = { from: web3.eth.defaultAccount };

            try {
                await newContractInstance.addEvidenceItems(1, itemIds, 'HandlerName', 'OrganizationName', options);
                console.log("INITIAL block created successfully.");
            } catch (error) {
                console.error("Error creating the INITIAL block:", error);
            }

            console.log("INITIAL block created.");
        } else {
            console.log("Blockchain file found with INITIAL block.");
        }
    } catch (error) {
        console.error("Error checking for blocks:", error);
    }
}

checkForBlocks();
