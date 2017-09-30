var RecoveryWallet = artifacts.require("./RecoveryWallet.sol");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));


module.exports = function(deployer) {

  deployer.deploy(RecoveryWallet,web3.eth.accounts[0]);
};
