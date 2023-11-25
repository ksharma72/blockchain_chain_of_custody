const fs = require('fs');
const path = require('path');
// Deployment logic here...
// Write the contract address to the config file
fs.writeFileSync(path.join(__dirname, '../build/contracts/ChainOfCustody.json'), JSON.stringify({ contractAddress: deployedAddress }));
