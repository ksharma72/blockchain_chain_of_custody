const Web3 = require("web3");
const contractABI = require("../build/contracts/ChainOfCustody.json");

// Assuming your Ethereum client (e.g., Ganache) uses network ID 5777
const networkId = "5777"; // Replace with your actual network ID
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
const web3 = new Web3("http://127.0.0.1:7545");
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

async function checkoutEvidenceItem(evidenceItemId, handler, organization) {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  try {
      let result = await contract.methods.checkoutEvidenceItem(evidenceItemId, handler, organization).send({ from: account, gas: 5000000 });
      let receipt = await web3.eth.getTransactionReceipt(result.transactionHash);

      if (receipt && receipt.logs) {
          const eventSignature = web3.utils.sha3('EvidenceItemCheckedOut(uint128,uint32,string,string,uint64,string)');

          receipt.logs.forEach((log) => {
              if (log.topics[0] === eventSignature) {
                  let event = web3.eth.abi.decodeLog([
                      { indexed: true, name: 'caseId', type: 'uint128' },
                      { indexed: true, name: 'evidenceItemId', type: 'uint32' },
                      { indexed: false, name: 'handlerName', type: 'string' },
                      { indexed: false, name: 'organizationName', type: 'string' },
                      { indexed: false, name: 'timestamp', type: 'uint64' },
                      { indexed: false, name: 'state', type: 'string' }
                  ], log.data, log.topics.slice(1));

                  console.log(`Checked out item: ${evidenceItemId}`);
                  console.log(`Case ID: ${event.caseId}`);
                  //console.log(`Handler: ${event.handlerName}`);
                  //console.log(`Organization: ${event.organizationName}`);
                  console.log(`Status: ${event.state}`);
                  console.log(`Time of action: ${new Date(event.timestamp * 1000).toISOString()}`);
              }
          });
      }
  } catch (error) {
      console.error("Error during checkout:", error.message);
  }
}


const evidenceItemId = process.argv[2]; // Accept evidence item ID from command line
const handler = process.argv[3]; // Accept evidence item ID from command line
const organization = process.argv[4]; // Accept evidence item ID from command line

checkoutEvidenceItem(evidenceItemId, handler, organization).then(() =>
  process.exit(0)
);
