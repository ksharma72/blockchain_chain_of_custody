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

async function removeEvidenceItem(itemId, reason, ownerInfo) {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0]; // Using the first account for transactions

  try {
    let result = await contract.methods
      .removeEvidenceItem(itemId, reason, ownerInfo)
      .send({
        from: account,
        gas: 5000000, // Setting a higher gas limit
      });

    let receipt = await web3.eth.getTransactionReceipt(result.transactionHash);

    if (receipt && receipt.logs) {
      let removedEvent = web3.eth.abi.decodeLog(
        [
          { type: "uint128", name: "caseId", indexed: true },
          { type: "uint32", name: "evidenceItemId", indexed: true },
          { type: "uint64", name: "timestamp" },
          { type: "string", name: "state" },
          { type: "string", name: "reason" },
          { type: "string", name: "ownerInfo" },
        ],
        receipt.logs[0].data,
        receipt.logs[0].topics.slice(1)
      );

      console.log(`Case: ${removedEvent.caseId}`);
      console.log(`Removed item: ${itemId}`);
      console.log(`State: ${removedEvent.state}`);
      console.log(`Reason: ${removedEvent.reason}`);
      console.log(`Owner info: ${removedEvent.ownerInfo}`);
      console.log(
        `Time of action: ${new Date(
          removedEvent.timestamp * 1000
        ).toISOString()}`
      );
    }
  } catch (error) {
    console.error("Error removing evidence item:", error.message);
  }
}

// Accepting command line arguments
const itemId = process.argv[2]; // Item ID
const reason = process.argv[3]; // Reason
const ownerInfo = process.argv[4]; // Owner Info

removeEvidenceItem(itemId, reason, ownerInfo).then(() => process.exit(0));
