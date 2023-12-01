const Web3 = require("web3");
const contractABI = require("../build/contracts/ChainOfCustody.json");

const networkId = "5777";
const contractData = contractABI.networks[networkId];

if (!contractData || !contractData.address) {
  console.error(
    "Contract not deployed on the current network (network ID: " + networkId + ")"
  );
  process.exit(1);
}

const contractAddress = contractData.address;

const web3 = new Web3("http://127.0.0.1:7545");
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);



async function showItemHistory(itemId) {
    try {
        let history = await contract.methods.getItemHistory(itemId).call();
        
        if (history.length === 0) {
            console.log(`No history found for item ${itemId}`);
            return;
        }

        // Create a new array of plain JavaScript objects
        let plainHistory = history.map(entry => ({
            caseId: entry.caseId,
            evidenceItemId: entry.evidenceItemId,
            timestamp: entry.timestamp,
            state: entry.state,
            handlerName: entry.handlerName
        }));

        // Sort the plainHistory array by timestamp
        plainHistory.sort((a, b) => a.timestamp - b.timestamp);

        console.log(`History for item ${itemId}:`);
        plainHistory.forEach(entry => {
            console.log(`Case: ${entry.caseId}`);
            console.log(`Item: ${entry.evidenceItemId}`);
            console.log(`Timestamp: ${new Date(entry.timestamp * 1000).toISOString()}`);
            console.log(`State: ${entry.state}`);
            console.log(`Handler: ${entry.handlerName}`);
            console.log('---');
        });
    } catch (error) {
        console.error("Error fetching item history:", error);
    }
}


// Accepting item ID from command line
const itemId = process.argv[2] ? parseInt(process.argv[2]) : 420;
showItemHistory(itemId);
