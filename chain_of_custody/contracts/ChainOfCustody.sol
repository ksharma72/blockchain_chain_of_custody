// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChainOfCustody {
    struct Block {
        bytes32 previousHash;
        uint64 timestamp;
        uint128 caseId;
        uint32 evidenceItemId;
        string state;
        string handlerName; // Changed from bytes20 to string
        string organizationName; // Changed from bytes20 to string
        string reason;
        uint32 dataLength;
        bytes data;
    }

    Block[] public blockchain;
    mapping(uint32 => bool) public evidenceExists;

    // Updated event to use strings
    event EvidenceItemAdded(
        uint128 indexed caseId,
        uint32 indexed evidenceItemId,
        uint64 timestamp,
        string state,
        string handlerName,
        string organizationName
    );

    // Updated function to accept string parameters
    function addEvidenceItems(
        uint128 _caseId,
        uint32[] memory _itemIds,
        string memory _handlerName,
        string memory _organizationName
    ) public {
        for (uint i = 0; i < _itemIds.length; i++) {
            require(
                !evidenceExists[_itemIds[i]],
                "Evidence item ID must be unique"
            );
            addBlock(
                _caseId,
                _itemIds[i],
                "CHECKEDIN",
                _handlerName,
                _organizationName,
                "",
                ""
            );
        }
    }

    // Updated function to accept string parameters
    function addBlock(
        uint128 _caseId,
        uint32 _evidenceItemId,
        string memory _state,
        string memory _handlerName,
        string memory _organizationName,
        string memory _reason,
        bytes memory _data
    ) private {
        bytes32 previousHash = blockchain.length > 0
            ? getLatestBlockHash()
            : bytes32(0);
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
            _reason,
            dataLength,
            _data
        );

        blockchain.push(newBlock);
        evidenceExists[_evidenceItemId] = true;

        emit EvidenceItemAdded(
            _caseId,
            _evidenceItemId,
            timestamp,
            _state,
            _handlerName,
            _organizationName
        );
    }

    function getLatestBlockHash() private view returns (bytes32) {
        Block storage lastBlock = blockchain[blockchain.length - 1];
        return
            keccak256(
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

    event EvidenceItemCheckedOut(
        uint128 indexed caseId,
        uint32 indexed evidenceItemId,
        string handlerName,
        string organizationName,
        uint64 timestamp,
        string state
    );

    function checkoutEvidenceItem(uint32 _evidenceItemId, string memory _handlerName, string memory _organizationName) public {
        require(
            evidenceExists[_evidenceItemId],
            "Error: Evidence item does not exist."
        );
        Block storage lastBlock = blockchain[blockchain.length - 1];
        require(
            lastBlock.evidenceItemId == _evidenceItemId,
            "Error: Wrong evidence item."
        );
        require(
            keccak256(abi.encodePacked(lastBlock.state)) !=
                keccak256(abi.encodePacked("CHECKEDOUT")),
            "Error: Cannot check out a checked out item. Must check it in first."
        );

        // Assuming 'addBlock' function updates the state and creates a new block in the blockchain
        addBlock(
            lastBlock.caseId,
            _evidenceItemId,
            "CHECKEDOUT",
            lastBlock.handlerName,
            lastBlock.organizationName,
            "",
            lastBlock.data
        );
        emit EvidenceItemCheckedOut(
            lastBlock.caseId,
            _evidenceItemId,
            _handlerName,
            _organizationName,
            uint64(block.timestamp),
            "CHECKEDOUT"
        );
    }

    event EvidenceItemCheckedIn(
        uint128 indexed caseId,
        uint32 indexed evidenceItemId,
        uint64 timestamp,
        string state,
        string handlerName,
        string organizationName
    );

    function checkinEvidenceItem(
    uint32 _evidenceItemId,
    string memory _handlerName,
    string memory _organizationName
) public {
    require(
        evidenceExists[_evidenceItemId],
        "Error: Evidence item does not exist."
    );

    bool isItemCheckedOut = false;
    uint128 caseIdForItem;

    // Iterate through the blockchain to find the specific block with the evidence item
    for (uint i = blockchain.length; i > 0; i--) {
        Block storage blockItem = blockchain[i - 1];
        if (blockItem.evidenceItemId == _evidenceItemId) {
            // Check if the item is in a checked out state
            if (keccak256(abi.encodePacked(blockItem.state)) == keccak256(abi.encodePacked("CHECKEDOUT"))) {
                isItemCheckedOut = true;
                caseIdForItem = blockItem.caseId;
                break;
            }
        }
    }

    require(isItemCheckedOut, "Error: Item is not checked out.");

    // Add a new block for checkin
    addBlock(
        caseIdForItem,
        _evidenceItemId,
        "CHECKEDIN",
        _handlerName,
        _organizationName,
        "",
        ""
    );

    emit EvidenceItemCheckedIn(
        caseIdForItem,
        _evidenceItemId,
        uint64(block.timestamp),
        "CHECKEDIN",
        _handlerName,
        _organizationName
    );
}


    function getCases() public view returns (uint128[] memory) {
        uint128[] memory cases = new uint128[](blockchain.length);
        uint count = 0;

        for (uint i = 0; i < blockchain.length; i++) {
            bool exists = false;
            for (uint j = 0; j < count; j++) {
                if (cases[j] == blockchain[i].caseId) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                cases[count] = blockchain[i].caseId;
                count++;
            }
        }

        // Resize the array to fit the actual number of unique cases
        uint128[] memory uniqueCases = new uint128[](count);
        for (uint i = 0; i < count; i++) {
            uniqueCases[i] = cases[i];
        }

        return uniqueCases;
    }

    function getItemsForCase(
        uint128 _caseId
    ) public view returns (uint32[] memory) {
        uint32[] memory itemsTemp = new uint32[](blockchain.length);
        uint count = 0;

        for (uint i = 0; i < blockchain.length; i++) {
            if (blockchain[i].caseId == _caseId) {
                itemsTemp[count] = blockchain[i].evidenceItemId;
                count++;
            }
        }

        // Resize the array to fit the actual number of items for the case
        uint32[] memory items = new uint32[](count);
        for (uint i = 0; i < count; i++) {
            items[i] = itemsTemp[i];
        }

        return items;
    }

    struct BlockInfo {
        uint64 timestamp;
        string handlerName;
        string state;
    }

    function getItemHistory(
        uint32 _itemId
    ) public view returns (BlockInfo[] memory) {
        BlockInfo[] memory history = new BlockInfo[](blockchain.length);
        uint count = 0;

        for (uint i = 0; i < blockchain.length; i++) {
            if (blockchain[i].evidenceItemId == _itemId) {
                history[count] = BlockInfo(
                    blockchain[i].timestamp,
                    blockchain[i].handlerName,
                    blockchain[i].state
                );
                count++;
            }
        }

        // Resize the array to fit the actual number of entries for the item
        BlockInfo[] memory itemHistory = new BlockInfo[](count);
        for (uint i = 0; i < count; i++) {
            itemHistory[i] = history[i];
        }

        return itemHistory;
    }

    event EvidenceItemRemoved(
        uint128 caseId,
        uint32 evidenceItemId,
        uint64 timestamp,
        string reason,
        string ownerInfo
    );

    function removeEvidenceItem(
        uint32 _evidenceItemId,
        string memory _reason,
        string memory _ownerInfo
    ) public {
        require(
            evidenceExists[_evidenceItemId],
            "Error: Evidence item does not exist."
        );

        Block storage lastBlock = blockchain[blockchain.length - 1];
        require(
            lastBlock.evidenceItemId == _evidenceItemId &&
                keccak256(abi.encodePacked(lastBlock.state)) ==
                keccak256(abi.encodePacked("CHECKEDIN")),
            "Error: Item must be checked in to be removed."
        );

        // Assuming 'addBlock' function updates the state and creates a new block in the blockchain
        addBlock(
            lastBlock.caseId,
            _evidenceItemId,
            _reason, // Include _reason in the call
            lastBlock.handlerName,
            lastBlock.organizationName,
            _ownerInfo, // Include _ownerInfo
            lastBlock.data
        );

        emit EvidenceItemRemoved(
            lastBlock.caseId,
            _evidenceItemId,
            uint64(block.timestamp),
            _reason,
            _ownerInfo
        );
    }
}
