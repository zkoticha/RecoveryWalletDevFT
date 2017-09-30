import React, { Component } from 'react';
//import { TextInput } from 'react-native';
import logo from './logo_dark.png';
import { Button } from '@blueprintjs/core';
import '@blueprintjs/core/dist/blueprint.css';
import './App.css';
var CryptoJS = require("crypto-js");
var Web3 = require('web3');

/**
 * Fix this to use proper state management and make API calls outside the frontend. 
 * If you're reading this and it hasn't been fixed I'm sorry.
 */
class App extends Component {

  constructor(props) {
    super(props);
    var web3 = new Web3();
    this.verify = this.verify.bind(this);
    this.post = this.post.bind(this);
    const abi = [{ "constant": false, "inputs": [{ "name": "data", "type": "bytes32" }], "name": "upload", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "data", "type": "bytes32" }], "name": "prove", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "data", "type": "bytes32" }, { "indexed": false, "name": "blockNumber", "type": "uint256" }], "name": "LogProof", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "data", "type": "bytes32" }, { "indexed": false, "name": "blockNumber", "type": "uint256" }], "name": "CheckProof", "type": "event" }]
    const address = '0xC570102F2BA08EF46c1C3d49D0C16C319479fBA2';
    web3 = new Web3(window.web3.currentProvider);
    const existence = web3.eth.contract(abi);
    const contract = existence.at(address);
    this.state = { spin: false, hashString: "", response: {}, contract: contract, web3: web3 }
      this.handleSubmit = this.handleSubmit.bind(this);
  }

  // onSubmitEditing = (text) => {
  //   // var reader = new FileReader();
  //   // reader.readAsArrayBuffer(acceptedFiles[0]);
  //   // const self = this;
  //   // reader.addEventListener("loadend", function () {
  //   //   self.setState({ spin: true });
  //   //   const wordArray = CryptoJS.lib.WordArray.create(reader.result);
  //   //   var hash = CryptoJS.SHA256(wordArray);
  //   //   console.log(hash.toString(CryptoJS.enc.Hex));
  //   //   self.setState({ hashString: hash.toString(CryptoJS.enc.Hex), uploading: false });
  //   //   /* Use the logged hash string above to post to the tangle */
  //   //   self.verify(self.state.hashString);
  //   //   /* Use one endpoint on the backend. Return the value that is the response,
  //   //   if the hash exists and is verified, return the associated data,
  //   //   if the hash does not exist return some data that indicates it was put on the chain*/
  //     console.log("we ist here")
  //
  // }

  // handleChange(e) {
  //   var currStr = e;
  // }
  //
  // handleClick () {
  //   this.state.hashString = currStr;
  //   console.log(this.state.hashString);
  // }

  verify(hash) {
    const self = this;
    this.state.contract.prove.call(hash, {}, "latest", function (error, result) {
      self.setState({ response: result.toString(), spin: false, proof: true });
    });
  }

  post(hash) {
    // now you can start using all of the functions
    this.setState({ spin: true });
    const self = this;
    this.state.contract.upload.sendTransaction(hash, { from: this.state.web3.eth.accounts[0] }, function (error, result) {
      self.setState({ proof: true, response: "Transaction Success! View Transaction at: https://kovan.etherscan.io/tx/" + result.substring(2) });
    });
  }

    handleSubmit(event) {
        this.state.contract.
        event.preventDefault();
    }

  render() {
    return (
      <div className="App container-fluid">
        <div className="row pad-1">
          <div className="col-sm-3"><h1>Proof of Existence</h1></div>
          <div className="col-sm-6"></div>
          <div className="col-sm-3"></div>
          {/* <img src='./logo_dark.png' height="64px"/>*/}
        </div>
        <div className="row pad-1">
          <div className="pt-card col-md-6">
            <form onSubmit={this.handleSubmit}>
              <label>
                Name:
                <input type="text" ref={(input) => this.input = input} />
              </label>
              <input type="submit" value="Submit" />
            </form>
          </div>
          <div className="col-md-3"></div>
        </div>
        <div className="row pad-1">
          <div className="col-md-3"></div>
          {this.state.hashString === "" ? <div className="col-md-6"></div> :
            this.state.proof ?
              <div className="pt-card col-md-6">
                <h3>The Proof</h3>
                <div className="pt-card pt-elevation 1 pad-1">
                  <code>{this.state.hashString}</code>
                  <div>{this.state.response.toString() === "0" ?
                    <div>
                      <h4 className="pt-ui-text-large">The file has not been recorded</h4>
                      <Button onClick={() => {
                        this.post(this.state.hashString);
                      }}>Document Proof</Button>
                    </div>
                    : <h4 className="pt-ui-text-large">{this.state.response === "" ? "" :
                      this.state.response.includes("Transaction") ? 
                        <div>{this.state.response.substring(0, this.state.response.indexOf('at'))} <a href={"https://kovan.etherscan.io/tx/0x" + this.state.response.substring(this.state.response.indexOf('tx/') + 3).toString()}>here</a></div>
                       : <div>Mined at Blockq Number: <a href={"https://kovan.etherscan.io/block/" + this.state.response.substring(this.state.response.indexOf('tx/') + 1).toString()}>{this.state.response.toString()}</a></div>
                    }</h4>
                  }
                  </div>
                </div>
              </div>
              : <div></div>
          }
          <div className="col-md-3"></div>
        </div>
      </div>
    );
  }
}

export default App;
