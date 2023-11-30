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
        let result = await contract.methods.checkinEvidenceItem(evidenceItemId, handlerName, organizationName).send({ from: account, gas: 6000000 });
        let receipt = await web3.eth.getTransactionReceipt(result.transactionHash);

        if (receipt && receipt.logs) {
            const eventSignature = web3.utils.sha3('EvidenceItemCheckedIn(uint128,uint32,uint64,string,string,string)');

            receipt.logs.forEach((log) => {
                if (log.topics[0] === eventSignature) {
                    let event = web3.eth.abi.decodeLog([
                        { indexed: true, name: 'caseId', type: 'uint128' },
                        { indexed: true, name: 'evidenceItemId', type: 'uint32' },
                        { indexed: false, name: 'timestamp', type: 'uint64' },
                        { indexed: false, name: 'state', type: 'string' },
                        { indexed: false, name: 'handlerName', type: 'string' },
                        { indexed: false, name: 'organizationName', type: 'string' }
                    ], log.data, log.topics.slice(1));
            
                    console.log(`Checked in item: ${evidenceItemId}`);
                    console.log(`Case ID: ${event.caseId}`);
                    console.log(`Status: ${event.state}`);
                    //console.log(`Handler Name: ${event.handlerName}`);
                    //console.log(`Organization Name: ${event.organizationName}`);
                    console.log(`Time of action: ${new Date(event.timestamp * 1000).toISOString()}`);
                }
            });
            
        } else {
            console.error('Transaction failed');
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
