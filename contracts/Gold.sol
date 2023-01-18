// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Imports

// Interfaces and Libraries

// Contracts
contract Gold {
    // -- Type Declarations --
    address payable private immutable i_owner;
    address payable private s_user;
    mapping(address => uint256) private s_balance;
    // -- State Variables --
    uint256 public sharePrice = 1e18;
    // -- Events --
    // -- Modifiers --
    modifier ownlyOwner() {
        require(msg.sender == i_owner, "Ownly owner can call this function");
        _;
    }

    // -- Functions --
    //     -- Constructor
    constructor() {
        i_owner = payable(msg.sender);
    }

    //     -- Receive
    receive() external payable {}

    //     -- Fallback
    fallback() external payable {}

    //     -- External - View/Pure
    function getUserBalance() public view returns (uint256) {
        return s_balance[msg.sender];
    }

    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    //     -- Public
    function buyShare(uint256 _shareAmount) public payable {
        require(msg.value >= _shareAmount * sharePrice, "Not enough ETH.");
        (bool success, ) = address(this).call{value: _shareAmount * sharePrice}(
            ""
        );
        require(success, "Failed deposit");
        s_balance[msg.sender] += _shareAmount * sharePrice;
    }
    //     -- Internal
    //     -- Private
}
