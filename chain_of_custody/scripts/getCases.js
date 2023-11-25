async function showCases() {
    const contractInstance = await ChainOfCustody.deployed(); // Ensure ChainOfCustody is your contract name

    try {
        let caseIds = await contractInstance.getCases();
        console.log("Cases:");
        caseIds.forEach(caseId => {
            console.log(caseId.toString().padStart(6, '0')); // Formatting case ID with leading zeros
        });
    } catch (error) {
        console.error("Error fetching cases:", error);
    }
}
showCases();