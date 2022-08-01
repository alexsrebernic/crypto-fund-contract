// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import "./Donee.sol";
contract Donations {
    address payable public owner;
    address[] public donees;
    mapping (address => address) userToContract;
    event newDonee (address _donee);
    modifier onlyOwner() {
        if (msg.sender != owner) revert FundMe__NotOwner();
        _;
    }
    constructor() {
        owner = payable(msg.sender);
    }
    function pushDonee(address _donee) external {
        donees.push(_donee);
        emit newDonee(_donee);
    }
    function killContract() external onlyOwner {
        selfdestruct(owner);
    }
    function getUserDoneeContract(address _user) external view returns(address){
        return userToContract[_user];
    }
    function getDonees() public view onlyOwner returns(address[] memory) {
        return donees;
    }
}
