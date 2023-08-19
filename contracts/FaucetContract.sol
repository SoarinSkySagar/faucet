// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Faucet {
    uint public numFunders;
    mapping(uint => address) public funders;

    receive() external payable {}

    function addFunds() external payable {

        bool exists = false;
        for (uint a = 0; a < numFunders; a++) {
            if (funders[a] == msg.sender) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            uint index = numFunders++;
            funders[index] = msg.sender;
        }
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numFunders);
        for (uint i = 0; i < numFunders; i++) {
            _funders[i] = funders[i];
        }
        return _funders;
    }

    function getFunderIndex(uint index) external view returns (address) {
        return funders[index];
    }
}

// const instance = await Faucet.deployed()
// instance.addFunds({from: accounts[0], value: "200000000000"})