// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChainOfCustody {
    struct Block {
        bytes32 previousHash;
        uint64 timestamp;
        bytes16 caseId;
        uint32 evidenceItemId;
        bytes12 state;
        bytes20 handlerName;
        bytes20 organizationName;
        uint32 dataLength;
        bytes data;
    }

    Block[] public chain; // Array to store blocks

    event BlockchainAction(
        bytes12 action,
        uint32 evidenceItemId,
        bytes16 caseId,
        bytes32 timestamp
    );

    constructor() {
        // Initializing the blockchain with the initial block
        _addBlock(
            bytes32(0),
            bytes16(0),
            0,
            "INITIAL",
            "System",
            "System",
            0,
            ""
        );
    }

    function add(
        bytes16[] memory _caseIds,
        uint32[] memory _evidenceItemIds,
        bytes12 _state,
        bytes20 _handlerName,
        bytes20 _organizationName,
        uint32 _dataLength,
        bytes memory _data
    ) public {
        require(_state == "CHECKEDIN", "State must be CHECKEDIN");
        require(
            _caseIds.length == _evidenceItemIds.length,
            "Array lengths do not match"
        );

        for (uint i = 0; i < _caseIds.length; i++) {
            require(_caseIds[i] != bytes16(0), "Invalid case ID");
            require(_evidenceItemIds[i] != 0, "Invalid evidence item ID");
            require(
                !isEvidenceItemIdUsed(_evidenceItemIds[i]),
                "Evidence item ID already exists"
            );

            _addBlock(
                chain[chain.length - 1].previousHash,
                _caseIds[i],
                _evidenceItemIds[i],
                _state,
                _handlerName,
                _organizationName,
                _dataLength,
                _data
            );
        }
    }

    function isEvidenceItemIdUsed(
        uint32 _evidenceItemId
    ) internal view returns (bool) {
        for (uint i = 0; i < chain.length; i++) {
            if (chain[i].evidenceItemId == _evidenceItemId) {
                return true;
            }
        }
        return false;
    }

    function _addBlock(
        bytes32 _previousHash,
        bytes16 _caseId,
        uint32 _evidenceItemId,
        bytes12 _state,
        bytes20 _handlerName,
        bytes20 _organizationName,
        uint32 _dataLength,
        bytes memory _data
    ) internal {
        Block memory newBlock = Block({
            previousHash: _previousHash,
            timestamp: uint64(block.timestamp),
            caseId: _caseId,
            evidenceItemId: _evidenceItemId,
            state: _state,
            handlerName: _handlerName,
            organizationName: _organizationName,
            dataLength: _dataLength,
            data: _data
        });

        chain.push(newBlock);

        emit BlockchainAction(
            _state,
            newBlock.evidenceItemId,
            newBlock.caseId,
            bytes32(uint256(newBlock.timestamp))
        );
    }
}
