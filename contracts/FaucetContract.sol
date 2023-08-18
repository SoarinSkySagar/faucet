// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Faucet {
    receive() external payable {}

    function addFunds() external payable {}

    function test() external pure returns(uint) {
        return 2 + 2;
    }
}