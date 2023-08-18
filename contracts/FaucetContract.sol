// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Faucet {
    address[] public funders;

    receive() external payable {}

    function addFunds() external payable {
        bool exists = false;
        for (uint256 i = 0; i < funders.length; i++) {
            if (funders[i] == msg.sender) {
                exists = true;
                break;
            }
        }
        if (!exists) {
            funders.push(msg.sender);
        }
    }

    function getAllFunders() public view returns (address[] memory) {
        return funders;
    }

    function getFunderIndex(uint index) external view returns (address) {
        address[] memory _funders = getAllFunders();
        return _funders[index];
    }
}

// const instance = await Faucet.deployed()