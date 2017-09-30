import _ from 'lodash';
import {web, util} from './init.js';

import expect from 'expect.js';
import {RecoveryWalletCreated, Recovered} from './utils/RecoveryWalletEvents.js'

const RecoveryWallet = artifacts.require("./RecoveryWallet.sol");
contract("RecoveryWallet", (accounts) => {

    let recovWal;

    before(async () => {
        recovWal = await RecoveryWallet.deployed();
    })


    describe("#walletCreated()", () => {
        it("should have correct owner", async () => {

            // util.assertEventEquality(recovWal.logs[0], RecoveryWalletCreated({
            //     owner : accounts[0],
            //     recoveryPass: "625ef9d1b8b0a6058c79cd053f542f42980a8c33"
            //
            // }))

            var owner = await recovWal.owner.call();

            expect(owner).to.be(accounts[0]);
        });

        it("owner sets password", async () => {

            // util.assertEventEquality(recovWal.logs[0], RecoveryWalletCreated({
            //     owner : accounts[0],
            //     recoveryPass: "625ef9d1b8b0a6058c79cd053f542f42980a8c33"
            //
            // }))

            var owner = await recovWal.setPass(web3.sha3('0x73656375726570617373', {encoding: 'hex'}),{from: accounts[0]});

            //expect(owner).to.be(accounts[0]);
        });
    })


    describe("#sendEthToWallet()", () => {
        it("should successfuly send Ether to contract", async () => {
            var amount = web3.toWei(1, "ether");
            var init_bal = web3.eth.getBalance(recovWal.address);
            var sendEth = await web3.eth.sendTransaction({from:accounts[1], to:recovWal.address, value: amount});
            var end_bal = web3.toBigNumber(web3.eth.getBalance(recovWal.address));

            expect(init_bal.toString()).to.be(end_bal.sub(web3.toBigNumber(web3.toWei(1, "ether"))).toString());
        });
    })

    describe("#ownerCanRedeem()", () => {
        it("accounts[0] should successfuly withdraw all funds", async () => {
            var contract_bal = web3.eth.getBalance(recovWal.address);

            var acct_init_bal = web3.fromWei(web3.eth.getBalance(accounts[0]),'ether');
            var sendEth = await recovWal.withdraw(contract_bal,{from:accounts[0]});
            var acct_end_bal = web3.fromWei(web3.eth.getBalance(accounts[0]),'ether');

            const gasCost =  web3.fromWei(await util.getGasCosts(sendEth),'ether');
            // console.log(web3.fromWei(contract_bal.toString()),'ether');
            // console.log(acct_end_bal.toString());
            // console.log(acct_init_bal.toString());
            // console.log(gasCost.toString());


            expect(acct_init_bal.round(0,1).toString()).to.be(acct_end_bal.sub(web3.fromWei(contract_bal,'ether')).plus(gasCost).round(0,1).toString());
        });

        it("Contract should have no funds", async () => {
            var contract_bal = web3.fromWei(web3.eth.getBalance(recovWal.address),'ether');
            expect(contract_bal.toString()).to.be('0');
        });

    })

    describe( "#ownerChangedWithPassword()", () => {
        igit remote add origin https://github.com/zkoticha/RecoveryWalletDevFT.gitt("should successfuly send Ether to contract round 2", async () => {
            var amount = web3.toWei(1, "ether");
            var init_bal = web3.eth.getBalance(recovWal.address);
            var sendEth = await web3.eth.sendTransaction({from:accounts[2], to:recovWal.address, value: amount});
            var end_bal = web3.toBigNumber(web3.eth.getBalance(recovWal.address));

            expect(init_bal.toString()).to.be(end_bal.sub(web3.toBigNumber(web3.toWei(1, "ether"))).toString());
        });

        it("should be able to recover account with password", async () => {
            // console.log(web3.toHex('securepass'));
            // // console.log(web3.sha3('securepass'));
            //  console.log(web3.sha3('0x73656375726570617373', {encoding: 'hex'}));

            var passwordChange = await recovWal.recoverWithPass(web3.toHex('securepass'), {from: accounts[3]});

            util.assertEventEquality(passwordChange.logs[0], Recovered({
                 recoveryPass: web3.sha3('securepass')

             }))
        });


    })

    describe( "#newOwnerCanUse()", () => {
        it("should have new correct owner", async () => {

            // util.assertEventEquality(recovWal.logs[0], RecoveryWalletCreated({
            //     owner : accounts[0],
            //     recoveryPass: "625ef9d1b8b0a6058c79cd053f542f42980a8c33"
            //
            // }))

            var owner = await recovWal.owner.call();

            expect(owner).to.be(accounts[3]);
        });

        it("accounts[3] should successfuly withdraw all funds", async () => {
            var contract_bal = web3.eth.getBalance(recovWal.address);

            var acct_init_bal = web3.fromWei(web3.eth.getBalance(accounts[3]),'ether');
            var sendEth = await recovWal.withdraw(contract_bal,{from:accounts[3]});
            var acct_end_bal = web3.fromWei(web3.eth.getBalance(accounts[3]),'ether');

            const gasCost =  web3.fromWei(await util.getGasCosts(sendEth),'ether');
            //console.log(web3.fromWei(contract_bal.toString()),'ether');
            // console.log(acct_end_bal.toString());
            // console.log(acct_init_bal.toString());
            // console.log(gasCost.toString());


            expect(acct_init_bal.round(0,1).toString()).to.be(acct_end_bal.sub(web3.fromWei(contract_bal,'ether')).plus(gasCost).round(0,1).toString());
        });
    })


})