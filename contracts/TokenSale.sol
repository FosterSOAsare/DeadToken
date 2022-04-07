// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;
import "./DeadToken.sol";

contract TokenSale {
    address payable admin;
    uint256 public tokenPrice;
    uint256 fixedTokenSale = 50000000;
    uint256 public tokenSold;
    address payable contractAddress;
    DeadToken public tokenContract;

    constructor(
        DeadToken _address,
        uint256 _tokenPrice,
        address payable _admin
    ) {
        tokenContract = _address;
        tokenPrice = _tokenPrice;
        admin = _admin;
        contractAddress = payable(address(this));
    }

    event Sell(address indexed _to, uint256 _value);

    function BuyToken(uint256 _value) public payable returns (bool success) {
        require(
            _value * tokenPrice <= msg.value,
            "Insufficient funds to purchase tokens"
        );
        require(
            tokenContract.balanceOf(address(this)) >= _value,
            "Insufficient tokens to complete request"
        );
        require(tokenContract.transfer(msg.sender, _value));

        emit Sell(msg.sender, _value);
        return true;
    }

    function endSale() public payable returns (bool success) {
        require(msg.sender == admin, "Restricted to admins only");
        address deployer = tokenContract.deployer();
        uint256 remainingBalance = tokenContract.balanceOf(address(this));
        require(tokenContract.transfer(deployer, remainingBalance));

        admin.transfer(contractAddress.balance);
        // Destroy the contract
        selfdestruct(contractAddress);
        return true;
    }
}
