async function removeEvidenceItem(itemId, reason, ownerInfo) {
    const contractInstance = await ChainOfCustody.deployed(); // Ensure ChainOfCustody is your contract name

    try {
        let result = await contractInstance.removeEvidenceItem(itemId, reason, ownerInfo);
        let receipt = await web3.eth.getTransactionReceipt(result.transactionHash);

        if (receipt && receipt.logs) {
            // Assuming the event is properly emitted in the Solidity function
            let removedEvent = web3.eth.abi.decodeLog(
                [
                    { type: 'uint128', name: 'caseId', indexed: true },
                    { type: 'uint32', name: 'evidenceItemId', indexed: true },
                    { type: 'uint64', name: 'timestamp' },
                    { type: 'string', name: 'reason' },
                    { type: 'string', name: 'ownerInfo' }
                ],
                receipt.logs[0].data,
                receipt.logs[0].topics.slice(1)
            );

            console.log(`Removed item: ${itemId}`);
            console.log(`Status: ${removedEvent.reason}`);
            console.log(`Owner info: ${removedEvent.ownerInfo}`);
            console.log(`Time of action: ${new Date(removedEvent.timestamp * 1000).toISOString()}`);
        }
    } catch (error) {
        console.error("Error removing evidence item:", error);
    }
}

// Example usage
let itemId = 987654321; // Replace with your item ID
let reason = "RELEASED"; // Replace with the removal reason
let ownerInfo = "John Doe, 123 Cherry Ln, Pleasant, AZ 84848, 480-XXX-4321"; // Replace with owner info
removeEvidenceItem(itemId, reason, ownerInfo);
