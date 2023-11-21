pragma solidity ^0.8.0;

contract ChainOfCustody {
    // Define a struct to represent a block in the blockchain
    struct Block {
        bytes32 previousHash;
        uint64 timestamp;
        uint128 caseId;
        uint32 evidenceItemId;
        bytes12 state;
        bytes20 handlerName;
        bytes20 organizationName;
        uint32 dataLength;
        bytes data;
    }

    // Array to store blocks
    Block[] public blocks;

    // Event for emitting transaction details
    event AddedItem(uint indexed itemId, uint indexed caseId, bytes12 status, uint timestamp);

    // Function to add a new evidence item
    function addItem(
        uint caseId,
        uint itemId,
        bytes20 itemHandlerName, // Fixed size for handler name
        bytes20 itemOrganizationName, // Fixed size for organization name
        uint32 itemDataLength, // Length of the data
        bytes calldata itemData // Variable length data
    ) public {
        // Create a new block with provided data
        Block memory newBlock;
        newBlock.previousHash = blocks.length > 0 ? blocks[blocks.length - 1].previousHash : bytes32(0); // Use 0 for initial block
        newBlock.timestamp = uint64(block.timestamp);
        newBlock.caseId = uint128(caseId);
        newBlock.evidenceItemId = uint32(itemId);
        newBlock.state = bytes12("CHECKEDIN");

        // Set handlerName and organizationName
        newBlock.handlerName = itemHandlerName;
        newBlock.organizationName = itemOrganizationName;

        // Set data and dataLength
        newBlock.data = itemData;
        newBlock.dataLength = itemDataLength;

        // Add the new block to the blockchain
        blocks.push(newBlock);

        // Emit an event for the action
        emit AddedItem(itemId, caseId, newBlock.state, block.timestamp);
    }

    // Other functions for checkout, checkin, show cases, etc.

    // Constructor to initialize the contract
    constructor() {
        // Initialize any variables or settings here
    }
}
