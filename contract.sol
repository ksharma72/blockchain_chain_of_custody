// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EvidenceRegistry {
	//event declarations
	event EvidenceCheckedOut(uint128 id, address indexed checkedOutBy);
	event EvidenceCheckedIn(uint128 id, address indexed checkedInBy);

	enum State { CHECKEDIN, CHECKEDOUT, DISPOSED, DESTROYED, RELEASED } // State of evidence

	struct Evidence {
		uint32 id;
    		string description;
        	State state;
        	uint128 caseId;
   	 }

    	uint128[] private caseIds; // Dynamic array to store caseIds

    	mapping(uint32 => Evidence) public evidenceMap; // Maps evidence ID to Evidence
    	mapping(uint128 => uint32[]) public caseToEvidence; // Maps caseId to an array of evidence IDs

    	event EvidenceAdded(uint32 indexed evidenceId, uint128 indexed caseId, string description, State state);

    	// Function to add a new evidence item or multiple items to a case
    	function addEvidence(uint32[] memory itemIds, uint128 caseId, string[] memory descriptions) public {
        	require(itemIds.length == descriptions.length, "Item IDs and descriptions count mismatch");

        	for (uint32 i = 0; i < itemIds.length; i++) {
            		uint32 itemId = itemIds[i];
            		require(evidenceMap[itemId].id == 0, "Evidence ID must be unique");

            		// Create a new evidence item and add it to the evidence map
	    		// If the caseId is new, add it to the caseIds array
			if (caseToEvidence[caseId].length == itemIds.length) {
			    caseIds.push(caseId);
			}
		    evidenceMap[itemId] = Evidence({
			id: itemId,
			description: descriptions[i],
			state: State.CHECKEDIN,
			caseId: caseId
		    });

		    // Associate the evidence item with the given case identifier
		    caseToEvidence[caseId].push(itemId);

		    emit EvidenceAdded(itemId, caseId, descriptions[i], State.CHECKEDIN);
		}

		// If the caseId is new, add it to the caseIds array
		if (caseToEvidence[caseId].length == itemIds.length) {
		    caseIds.push(caseId);
		}
	    }

	//checkout an evidence item
	function checkoutEvidence(uint32 evidenceId) public 
	{
		Evidence storage evidence = evidenceMap[evidenceId];
		require(evidence.id !=0, "Evidence item does not exist");
		require(evidence.state == State.CHECKEDIN, "item is not CHECKEDIN");
		
		evidence.state = State.CHECKEDOUT;
		emit EvidenceCheckedOut(evidenceId, msg.sender);
	}
	function checkinEvidence(uint32 evidenceId) public 
	{
		Evidence storage evidence = evidenceMap[evidenceId];
		require(evidence.id != 0, "Evidence item does not exist");
		require(evidence.state == State.CHECKEDOUT, "Evidence item is not in a CHECKEDOUT state");

		evidence.state = State.CHECKEDIN; // Update the state of the evidence item to CHECKEDIN

		emit EvidenceCheckedIn(evidenceId, msg.sender); // Emit an event for the check-in action
	}

	//show cases
	function getAllCaseIds() public view returns (uint128[] memory) {
		return caseIds;
	}
	//show items
	//show history
	//remove
	//init
	//verify
	//-c case_id
	//-i item_id
	//-n num_entries
	//-y reason, --why reason
	//-o owner
}
