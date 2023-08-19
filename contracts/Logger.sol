// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

abstract contract Logger {
    uint hi = 1000;

    constructor() {
        hi = 2000;
    }

    function emitLog() virtual pure public returns (bytes32);
}   