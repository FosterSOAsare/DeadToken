// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
import "./DeadToken.sol";

contract TokenSale {
    uint256 tokenPrice;
    DeadToken public tokenContract;

    constructor(DeadToken _address, uint256 _tokenPrice) {
        tokenContract = _address;
        tokenPrice = _tokenPrice;
    }
}
