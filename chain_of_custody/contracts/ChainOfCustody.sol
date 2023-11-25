// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChainOfCustody {
    struct Block {
        bytes32 previousHash;
        uint64 timestamp;
        uint128 caseId;
        uint32 evidenceItemId;
        bytes12 state;
        string handlerName; // Changed from bytes20 to string
        string organizationName; // Changed from bytes20 to string
        uint32 dataLength;
        bytes data;
    }

    Block[] public blockchain;
    mapping(uint32 => bool) public evidenceExists;

    // Updated event to use strings
    event EvidenceItemAdded(uint128 caseId, uint32 evidenceItemId, uint64 timestamp, bytes12 state, string handlerName, string organizationName);

    // Updated function to accept string parameters
    function addEvidenceItems(uint128 _caseId, uint32[] memory _itemIds, string memory _handlerName, string memory _organizationName) public {
        for (uint i = 0; i < _itemIds.length; i++) {
            require(!evidenceExists[_itemIds[i]], "Evidence item ID must be unique");
            addBlock(_caseId, _itemIds[i], "CHECKEDIN", _handlerName, _organizationName, "");
        }
    }

    // Updated function to accept string parameters
    function addBlock(uint128 _caseId, uint32 _evidenceItemId, bytes12 _state, string memory _handlerName, string memory _organizationName, bytes memory _data) private {
        bytes32 previousHash = blockchain.length > 0 ? getLatestBlockHash() : bytes32(0);
        uint64 timestamp = uint64(block.timestamp);
        uint32 dataLength = uint32(_data.length);

        Block memory newBlock = Block(
            previousHash,
            timestamp,
            _caseId,
            _evidenceItemId,
            _state,
            _handlerName,
            _organizationName,
            dataLength,
            _data
        );

        blockchain.push(newBlock);
        evidenceExists[_evidenceItemId] = true;

        emit EvidenceItemAdded(_caseId, _evidenceItemId, timestamp, _state, _handlerName, _organizationName);
    }

    function getLatestBlockHash() private view returns (bytes32) {
        Block storage lastBlock = blockchain[blockchain.length - 1];
        return keccak256(
            abi.encodePacked(
                lastBlock.previousHash,
                lastBlock.timestamp,
                lastBlock.caseId,
                lastBlock.evidenceItemId,
                lastBlock.state,
                lastBlock.handlerName,
                lastBlock.organizationName,
                lastBlock.dataLength,
                lastBlock.data
            )
        );
    }

    event EvidenceItemCheckedOut(uint128 caseId, uint32 evidenceItemId, uint64 timestamp, bytes12 state);

    function checkoutEvidenceItem(uint32 _evidenceItemId) public {
        require(evidenceExists[_evidenceItemId], "Error: Evidence item does not exist.");
        Block storage lastBlock = blockchain[blockchain.length - 1];
        require(lastBlock.evidenceItemId == _evidenceItemId, "Error: Wrong evidence item.");
        require(lastBlock.state != "CHECKEDOUT", "Error: Cannot check out a checked out item. Must check it in first.");

        // Assuming 'addBlock' function updates the state and creates a new block in the blockchain
        addBlock(lastBlock.caseId, _evidenceItemId, "CHECKEDOUT", lastBlock.handlerName, lastBlock.organizationName, lastBlock.data);
        emit EvidenceItemCheckedOut(lastBlock.caseId, _evidenceItemId, uint64(block.timestamp), "CHECKEDOUT");
    }
}
