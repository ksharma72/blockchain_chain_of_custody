async function showItemHistory(itemId) {
  const contractInstance = await ChainOfCustody.deployed(); // Ensure ChainOfCustody is your contract name

  try {
    let history = await contractInstance.getItemHistory(itemId);
    console.log(`History for item ${itemId}:`);
    history.forEach((entry) => {
      let date = new Date(entry.timestamp * 1000).toISOString();
      let handlerName = entry.handlerName; // Directly using the string value
      let state = entry.state; // Directly using the string value
      console.log(`${date} ${handlerName} ${state}`);
    });
  } catch (error) {
    console.error("Error fetching item history:", error);
  }
}

// Accepting command line arguments (if needed)
const itemId = process.argv[2]; // Item ID from command line
showItemHistory(itemId);
