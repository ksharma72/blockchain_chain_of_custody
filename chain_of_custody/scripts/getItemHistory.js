async function showItemHistory(itemId) {
  const contractInstance = await ChainOfCustody.deployed(); // Ensure ChainOfCustody is your contract name

  try {
    let history = await contractInstance.getItemHistory(itemId);
    console.log(`History for item ${itemId}:`);
    history.forEach((entry) => {
      let date = new Date(entry.timestamp * 1000).toISOString();
      let handlerName = web3.utils.hexToAscii(entry.handlerName);
      let state = web3.utils.hexToAscii(entry.state);
      console.log(`${date} ${handlerName.trim()} ${state.trim()}`);
    });
  } catch (error) {
    console.error("Error fetching item history:", error);
  }
}
showItemHistory(itemId);
