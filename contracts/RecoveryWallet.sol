pragma solidity 0.4.15;
contract RecoveryWallet {

    bytes32 internal recoveryPassword;
    address public owner;

    event RecoveryWalletCreated(
    address walletOwner
    );

    event Recovered(bytes32 recoveryPass);

    function RecoveryWallet(address owner_) {
        owner = owner_;
        RecoveryWalletCreated(owner);
    }

    function setPass(bytes32 hashedPassword){
        require(msg.sender == owner);
        recoveryPassword = hashedPassword;
    }


    function recoverWithPass(bytes password){
        if (sha3(password) == recoveryPassword) {
            owner = tx.origin;
        } else {
            throw;
        }
        owner = tx.origin;
//        Recovered(recoveryPassword);
        Recovered(sha3(password));
    }

    function withdraw (uint amt) {
        require(amt <= this.balance);
        require(tx.origin == owner);
        tx.origin.transfer(amt);
    }

    function () payable {}
}