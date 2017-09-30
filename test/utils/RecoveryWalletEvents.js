module.exports = {
    RecoveryWalletCreated(params) {
        return {
            event: 'RecoveryWalletCreated',
            args: {
                walletOwner : params.walletOwner
            }
        }
    },
    Recovered(params) {
        return {
            event: 'Recovered',
            args: {
                recoveryPass : params.recoveryPass,
            }
        }
    }
}