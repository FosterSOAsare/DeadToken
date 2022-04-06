// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract DeadToken {
    address public deployer;
    string public name = "Dead Token";
    string public symbol = "DTK";
    uint256 public decimal = 8;

    uint256 public totalSupply;
    uint256 public mintTimestamp;
    uint256[] public mintTimes;
    uint256 public allowedMintTokens;

    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public frozenTokens;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _totalSupply) {
        totalSupply = _totalSupply;
        deployer = msg.sender;
        balanceOf[deployer] += totalSupply;
        allowedMintTokens = 1000000;
    }

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    event Mint(address indexed _to, uint256 _value);

    function transfer(address _to, uint256 _value)
        public
        payable
        returns (bool success)
    {
        require(balanceOf[msg.sender] >= _value, "Insuffiecient tokens");
        balanceOf[_to] += _value;
        balanceOf[msg.sender] -= _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _sender, uint256 _value) public {
        require(
            balanceOf[msg.sender] >= _value,
            "Insuffiecient tokens for approval"
        );
        allowance[msg.sender][_sender] = _value;
        emit Approval(msg.sender, _sender, _value);
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(
            allowance[_from][msg.sender] >= _value,
            "Insufficient allowance"
        );
        require(
            balanceOf[_from] >= _value,
            "Inssuffiecient balance to complete transaction "
        );
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function mintTokens(address _address, uint256 _value)
        public
        returns (bool success)
    {
        require(block.timestamp >= mintTimestamp, "mintTimestamp not reached");
        require(
            _value <= allowedMintTokens,
            "The number specified is more than the allowed mint tokens at the time"
        );
        require(msg.sender == deployer, "Restricted to deployer");

        // Increase the mintTimestamp by 6 months
        mintTimestamp = block.timestamp + 60 * 24 * 3600;
        mintTimes.push(block.timestamp);
        balanceOf[_address] += _value;
        balanceOf[deployer] -= _value;

        emit Mint(_address, _value);
        return true;
    }

    function freeze(uint256 _value) public returns (bool success) {
        require(
            balanceOf[msg.sender] >= _value,
            "Insuffiecient tokens to freeze"
        );

        balanceOf[msg.sender] -= _value;
        frozenTokens[msg.sender] += _value;
        return true;
    }

    function unfreeze(uint256 _value) public returns (bool success) {
        require(
            frozenTokens[msg.sender] >= _value,
            "Insuffiecient tokens to unfreeze"
        );

        frozenTokens[msg.sender] -= _value;
        balanceOf[msg.sender] += _value;
        return true;
    }
}
