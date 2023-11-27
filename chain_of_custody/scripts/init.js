const Web3 = require('web3');
const contractABI = require('../build/contracts/ChainOfCustody.json');

// Setup Web3 and contract instance
const networkId = '5777';
const contractData = contractABI.networks[networkId];
const contractAddress = contractData.address;
const web3 = new Web3('http://127.0.0.1:7545');
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

async function verifyBlockchain() {
    try {
        // Fetch the entire blockchain
        const blockchain = await contract.methods.getBlockchain().call();

        if (blockchain.length === 0) {
            console.log("Transactions in blockchain: 0\nState of blockchain: EMPTY");
            return;
        }

        // Verify the integrity of the blockchain
        for (let i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const previousBlock = blockchain[i - 1];

            // Check proper linking of blocks (hash comparison)
            const calculatedHash = calculateHash(previousBlock);
            if (currentBlock.previousHash !== calculatedHash) {
                console.log(`Transactions in blockchain: ${blockchain.length}\nState of blockchain: ERROR\nBad block: ${currentBlock.hash}\nParent block: ${previousBlock.hash || 'NOT FOUND'}`);
                return;
            }

            // Additional checks can be added here
        }

        console.log(`Transactions in blockchain: ${blockchain.length}\nState of blockchain: CLEAN`);
    } catch (error) {
        console.error('Error verifying blockchain:', error.message);
    }
}

function calculateHash(block) {
    // Implement the same hashing logic as in your Solidity contract
    return Web3.utils.soliditySha3(
        { t: 'bytes32', v: block.previousHash },
        { t: 'uint64', v: block.timestamp },
        // ... other fields
    );
}

verifyBlockchain().then(() => process.exit(0));

