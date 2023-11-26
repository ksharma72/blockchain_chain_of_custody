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
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0]; // Using the first account for transactions

  try {
    let result = await contract.methods
      .addEvidenceItems(caseId, itemIds, handler, organization)
      .send({
        from: account,
        gas: 5000000, // Setting a higher gas limit
      });

    let receipt = await web3.eth.getTransactionReceipt(result.transactionHash);

    if (receipt && receipt.logs) {
      receipt.logs.forEach((log) => {
        // Decode the event only if it's 'EvidenceItemAdded'
        if (
          log.topics[0] ===
          web3.utils.sha3("EvidenceItemAdded(uint128,uint32,uint64,string)")
        ) {
          let event = web3.eth.abi.decodeLog(
            [
              { type: "uint128", name: "caseId", indexed: true },
              { type: "uint32", name: "evidenceItemId", indexed: true },
              { type: "uint64", name: "timestamp" },
              { type: "string", name: "state" }, // Changed to string
            ],
            log.data,
            log.topics.slice(1)
          );

          console.log("Case:", event.caseId);
          console.log("Added item:", event.evidenceItemId);
          console.log("Status:", event.state); // No need to convert from hex
          console.log(
            "Time of action:",
            new Date(event.timestamp * 1000).toISOString()
          );
        }
      });
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
