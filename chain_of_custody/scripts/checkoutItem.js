async function checkoutEvidenceItem(evidenceItemId) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    try {
        let result = await contract.methods.checkoutEvidenceItem(evidenceItemId).send({ from: account });
        let receipt = await web3.eth.getTransactionReceipt(result.transactionHash);

        if (receipt && receipt.logs) {
            receipt.logs.forEach((log) => {
                let event = web3.eth.abi.decodeLog([
                    { type: 'uint128', name: 'caseId', indexed: true },
                    { type: 'uint32', name: 'evidenceItemId', indexed: true },
                    { type: 'uint64', name: 'timestamp' },
                    { type: 'bytes12', name: 'state' }
                ], log.data, log.topics.slice(1));

                console.log(`Checked out item: ${evidenceItemId}`);
                console.log(`Case ID: ${event.caseId}`);
                console.log(`Status: ${web3.utils.hexToAscii(event.state)}`);
                console.log(`Time of action: ${new Date(event.timestamp * 1000).toISOString()}`);
            });
        }
    } catch (error) {
        console.error('Error during checkout:', error.message);
    }
    
}

// Example usage
checkoutEvidenceItem(evidenceItemId);
