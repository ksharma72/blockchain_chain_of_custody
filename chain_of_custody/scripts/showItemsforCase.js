async function showItemsForCase(caseId) {
    const contractInstance = await ChainOfCustody.deployed(); // Ensure ChainOfCustody is your contract name

    try {
        let itemIds = await contractInstance.getItemsForCase(caseId);
        console.log(`Items for case ${caseId}:`);
        itemIds.forEach(itemId => {
            console.log(itemId.toString()); // Display each item ID
        });
    } catch (error) {
        console.error("Error fetching items for case:", error);
    }
}

showItemsForCase(caseId);
