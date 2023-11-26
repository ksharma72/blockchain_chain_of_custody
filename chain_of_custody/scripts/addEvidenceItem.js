const Web3 = require("web3");
const contractABI = require("../build/contracts/ChainOfCustody.json");

// Assuming you are using Ganache, which typically uses network ID '5777'
const networkId = "5777";
const contractData = contractABI.networks[networkId];

if (!contractData || !contractData.address) {
  console.error(
    "Contract not deployed on the current network (network ID: " +
      networkId +
      ")"
  );
  process.exit(1);
}

const contractAddress = contractData.address;

// Create a web3 instance with the URL of your Ethereum node
const web3 = new Web3("http://127.0.0.1:7545");
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

async function addEvidenceItems(caseId, itemIds, handler, organization) {
    //console.log("Attempting to add evidence items..."); // Debugging
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0]; // Using the first account for transactions
  
    try {
      //console.log("Sending transaction..."); // Debugging
      let result = await contract.methods
        .addEvidenceItems(caseId, itemIds, handler, organization)
        .send({ from: account, gas: 5000000 });
  
      //console.log("Transaction sent, getting receipt..."); // Debugging
      let receipt = await web3.eth.getTransactionReceipt(result.transactionHash);
  
      if (receipt && receipt.logs) {
        //console.log("Decoding logs..."); // Debugging
        receipt.logs.forEach((log) => {
            // Decode only if it's the 'EvidenceItemAdded' event
            if (log.topics[0] === web3.utils.sha3('EvidenceItemAdded(uint128,uint32,uint64,string,string,string)')) {
                let decodedLog = web3.eth.abi.decodeLog([
                    { indexed: false, name: 'caseId', type: 'uint128' },
                    { indexed: false, name: 'evidenceItemId', type: 'uint32' },
                    { indexed: false, name: 'timestamp', type: 'uint64' },
                    { indexed: false, name: 'state', type: 'string' },
                    { indexed: false, name: 'handlerName', type: 'string' },
                    { indexed: false, name: 'organizationName', type: 'string' }
                ], log.data);
        
                console.log(`Case: ${decodedLog.caseId}`);
                console.log(`Added item: ${decodedLog.evidenceItemId}`);
                console.log(`Status: ${decodedLog.state}`);
                console.log(`Time of action: ${new Date(decodedLog.timestamp * 1000).toISOString()}`);
            }
        });
        
      } else {
        console.log("No logs in transaction receipt."); // Debugging
      }
    } catch (error) {
      console.error("Error adding evidence items:", error.message);
    }
  }
  

// Accepting command line arguments
const caseId = process.argv[2];
const itemIds = process.argv[3].split(","); // Splitting item IDs into an array
const handler = process.argv[4]; // Handler
const organization = process.argv[5]; // Organization

addEvidenceItems(caseId, itemIds, handler, organization).then(() =>
  process.exit(0)
);
