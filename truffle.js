require("babel-register");
require("babel-polyfill");
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
        from: web3.eth.accounts[0] // Match any network id
    }
  }
};
