async function addEvidenceItem() {
    try {
      const caseID = process.argv[2] ? [parseInt(process.argv[2])] : ["0x123456789123456"];
      const evidenceItemID = process.argv[3] ? [parseInt(process.argv[3])] : [1];
      const state = process.argv[4] || "CHECKEDIN";
      const handlerName = process.argv[5] || "Kanishk";
      const organizationName = process.argv[6] || "FBI";
      const dataLength = process.argv[7] || [100];
      const data = process.argv[8] || "0xabcdef";
  
      const contractInstance = await artifacts.require("ChainOfCustody").deployed();
      const result = await contractInstance.add(
        caseID,
        evidenceItemID,
        state,
        handlerName,
        organizationName,
        dataLength,
        data
      );
      console.log(result); // This will display the transaction receipt if successful
    } catch (error) {
      console.error(error); // This will log any errors that occur during the function call
    }
  }
  
  addEvidenceItem();
  
