async function checkinEvidenceItem(evidenceItemId, handlerName, organizationName) {
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    // Convert handlerName and organizationName to bytes20 format
    let handlerNameBytes20 = web3.utils.asciiToHex(handlerName);
    let organizationNameBytes20 = web3.utils.asciiToHex(organizationName);

    try {
        let result = await contract.methods.checkinEvidenceItem(evidenceItemId, handlerNameBytes20, organizationNameBytes20).send({ from: account });
        let receipt = await web3.eth.getTransactionReceipt(result.transactionHash);

        if (receipt && receipt.logs) {
            receipt.logs.forEach((log) => {
                let event = web3.eth.abi.decodeLog([
                    { type: 'uint128', name: 'caseId', indexed: true },
                    { type: 'uint32', name: 'evidenceItemId', indexed: true },
                    { type: 'uint64', name: 'timestamp' },
                    { type: 'bytes12', name: 'state' },
                    { type: 'bytes20', name: 'handlerName' },
                    { type: 'bytes20', name: 'organizationName' }
                ], log.data, log.topics.slice(1));

                console.log(`Checked in item: ${evidenceItemId}`);
                console.log(`Case ID: ${event.caseId}`);
                console.log(`Status: ${web3.utils.hexToAscii(event.state)}`);
                console.log(`Handler Name: ${web3.utils.hexToAscii(event.handlerName)}`);
                console.log(`Organization Name: ${web3.utils.hexToAscii(event.organizationName)}`);
                console.log(`Time of action: ${new Date(event.timestamp * 1000).toISOString()}`);
            });
        }
    } catch (error) {
        console.error('Error during checkin:', error.message);
    }
}

// Example usage
let evidenceItemId = 987654321; // Your evidence item ID
let handlerName = "JohnDoe"; // Your handler name
let organizationName = "OrgName"; // Your organization name
checkinEvidenceItem(evidenceItemId, handlerName, organizationName);
