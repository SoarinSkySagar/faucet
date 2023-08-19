// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Owned {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner, 
            "Only the owner can call this function!"
        );
        _;
    }
}