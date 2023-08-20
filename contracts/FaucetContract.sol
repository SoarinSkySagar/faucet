// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    uint public numFunders;
    mapping(uint => address) public funders;

    function transferOwnership(address newOwner) external onlyOwner() {
        owner = newOwner;
    }

    modifier withdrawLimit(uint amount) {
        require(
            amount <= 1000000000000000000, 
            "You can not withdraw more than 1 ETH at once!"
        );
        _;
    } 

    receive() external payable {}

    function emitLog() public override pure returns (bytes32) {
        return "Hello, World!";
    }

    function addFunds() override external payable {

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

    function withdraw(uint256 amount) override external {
            payable(msg.sender).transfer(amount);
    }
}

// const instance = await Faucet.deployed()
// instance.addFunds({from: accounts[0], value: "1000000000000000"})
// instance.withdraw("50000000000000", {from: accounts[1]})