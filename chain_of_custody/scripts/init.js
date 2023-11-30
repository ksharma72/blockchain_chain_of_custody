const fs = require("fs");
const Contract = require("truffle-contract");
const Web3 = require("web3");
const ChainOfCustodyArtifact = require("../build/contracts/ChainOfCustody.json");
const { spawn } = require("child_process");

const ChainOfCustody = Contract(ChainOfCustodyArtifact);
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));

ChainOfCustody.setProvider(web3.currentProvider);

function getContractAddress() {
  const networkId = "5777";
  const contractData = ChainOfCustodyArtifact.networks[networkId];

  if (!contractData || !contractData.address) {
    console.error("Contract not deployed on the current network (network ID: " + networkId + ")");
    process.exit(1);
  }

  return contractData.address;
}

async function isPortOpen(port) {
  return new Promise((resolve) => {
    const net = require("net");
    const tester = net.createConnection(port);

    tester.once("error", () => {
      resolve(false);
    });

    tester.once("connect", () => {
      tester.end();
      resolve(true);
    });
  });
}

async function runTruffleMigrate() {
  return new Promise((resolve, reject) => {
    console.log("Running Truffle migrate...");
    const truffleMigrate = spawn("truffle", ["migrate", "--reset"], { shell: true });

    truffleMigrate.on("exit", (code) => {
      if (code === 0) {
        console.log("Truffle migrate completed successfully.");
        resolve();
      } else {
        console.error("Truffle migrate failed. Please check the Truffle logs for details.");
        reject(new Error("Truffle migrate failed."));
      }
    });
  });
}

async function checkForBlocks() {
  try {
    const isGanacheRunning = await isPortOpen(7545);

    if (!isGanacheRunning) {
      console.log("Ganache not running. Starting Ganache...");
      spawn("ganache-cli", ["-p", "7545", "-i", "5777", "--db", "C:/Users/sharm/Downloads/ganache_data"], { shell: true, detached: true });

      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for Ganache to initialize
      console.log("Ganache started successfully.");

      // await runTruffleMigrate();
    }

    const contractAddress = getContractAddress();
    const contract = new web3.eth.Contract(ChainOfCustodyArtifact.abi, contractAddress);

    console.log("Checking for blocks...");
    const numberOfBlocks = await contract.methods.getBlockCount().call();

    if (numberOfBlocks === '0') {
      console.log("No blockchain file found, initializing new blockchain.");
      // Add logic to create the INITIAL block or other initialization steps
    } else {
      console.log(`Blockchain file found with ${numberOfBlocks} blocks.`);
      // Additional logic if the blockchain is already initialized
    }
  } catch (error) {
    console.error("Error checking for blocks:", error);
  }
}

checkForBlocks();
