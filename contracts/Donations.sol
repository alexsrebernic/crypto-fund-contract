// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./Donee.sol";
contract Donations {
    address payable public owner;
    address[] public donees;
    modifier onlyOwner() {
        if (msg.sender != owner) revert FundMe__NotOwner();
        _;
    }
    constructor() {
        owner = payable(msg.sender);
    }
    function pushDonee(address _donee) external {
        donees.push(_donee);
    }
    function killContract() external onlyOwner {
        selfdestruct(owner);
    }
    function getDonees() public view onlyOwner returns(address[] memory) {
        return donees;
    }
}