/* eslint-disable no-undef */
const Faucet = artifacts.require("Faucet");

module.exports = function(deployer) {
    deployer.deploy(Faucet)
}