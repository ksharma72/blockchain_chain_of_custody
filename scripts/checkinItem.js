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

// Create a web3 instance with the URL of your Ethereum node
const web3 = new Web3('http://127.0.0.1:7545');
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

async function checkinEvidenceItem(evidenceItemId, handlerName, organizationName) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    try {
        let result = await contract.methods.checkinEvidenceItem(evidenceItemId, handlerName, organizationName).send({ from: account, gas: 5000000 });
        let receipt = await web3.eth.getTransactionReceipt(result.transactionHash);

        if (receipt && receipt.logs) {
            receipt.logs.forEach((log) => {
                let event = web3.eth.abi.decodeLog([
                    { type: 'uint128', name: 'caseId', indexed: true },
                    { type: 'uint32', name: 'evidenceItemId', indexed: true },
                    { type: 'uint64', name: 'timestamp' },
                    { type: 'string', name: 'state' },
                    { type: 'string', name: 'handlerName' },
                    { type: 'string', name: 'organizationName' }
                ], log.data, log.topics.slice(1));

                console.log(`Checked in item: ${evidenceItemId}`);
                console.log(`Case ID: ${event.caseId}`);
                console.log(`Status: ${event.state}`);
                console.log(`Handler Name: ${event.handlerName}`);
                console.log(`Organization Name: ${event.organizationName}`);
                console.log(`Time of action: ${new Date(event.timestamp * 1000).toISOString()}`);
            });
        }
    } catch (error) {
        console.error('Error during checkin:', error.message);
    }
}

// Accepting command line arguments
const evidenceItemId = process.argv[2]; // Evidence item ID
const handlerName = process.argv[3]; // Handler name
const organizationName = process.argv[4]; // Organization name

checkinEvidenceItem(evidenceItemId, handlerName, organizationName).then(() => process.exit(0));
