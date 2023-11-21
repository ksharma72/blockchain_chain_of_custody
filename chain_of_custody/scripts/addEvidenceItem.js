const web3 = require("web3");

async function addItem(instance, web3) {
  try {
    let accounts = await web3.eth.getAccounts();

    let caseId = 123456; // Replace with your case ID
    let itemId = 987654; // Replace with your item ID
    let itemHandlerName = "Kanishk".padEnd(20, '\0'); // Replace with handler name padded to 20 bytes
    let itemOrganizationName = "FBI".padEnd(20, '\0'); // Replace with organization name padded to 20 bytes
    let itemData = "First Evidence"; // Replace with actual item data
    let itemDataLength = itemData.length; // Length of the data

    // Convert itemHandlerName and itemOrganizationName to bytes
    let itemHandlerNameBytes = web3.utils.asciiToHex(itemHandlerName);
    let itemOrganizationNameBytes = web3.utils.asciiToHex(itemOrganizationName);

    // Call the addItem function
    let result = await instance.addItem(
      caseId,
      itemId,
      itemHandlerNameBytes,
      itemOrganizationNameBytes,
      itemDataLength,
      web3.utils.asciiToHex(itemData),
      { from: accounts[0] }
    );
    console.log("Item added successfully:", result);
  } catch (err) {
    console.error("Error adding item:", err);
  }
}

module.exports = {
  addItem: addItem,
};
