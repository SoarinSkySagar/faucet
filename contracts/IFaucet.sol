// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IFaucet {
    function addFunds() external payable;
    function withdraw(uint256 amount) external;
}