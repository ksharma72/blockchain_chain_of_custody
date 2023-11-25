const ChainOfCustody = artifacts.require("ChainOfCustody");

module.exports = function (deployer) {
  deployer.deploy(ChainOfCustody);
};
