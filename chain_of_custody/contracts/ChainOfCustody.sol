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
        _addBlock(bytes32(0), bytes16(0), 0, "INITIAL", "System", "System", 0, "");
    }

    function add(
        bytes16 _caseId,
        uint32 _evidenceItemId,
        bytes12 _state,
        bytes20 _handlerName,
        bytes20 _organizationName,
        uint32 _dataLength,
        bytes memory _data
    ) public {
        require(_caseId != bytes16(0) && _evidenceItemId != 0, "Invalid inputs");

        _addBlock(
            chain[chain.length - 1].previousHash,
            _caseId,
            _evidenceItemId,
            _state,
            _handlerName,
            _organizationName,
            _dataLength,
            _data
        );
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
