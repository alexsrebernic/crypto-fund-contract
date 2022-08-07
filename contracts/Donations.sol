// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./Donee.sol";
contract Donations {
    address payable public owner;
    userAddressAndContractdAdress[] public donees;
    struct userAddressAndContractdAdress {
        address user_address;
        address contract_address;
    }
    event newDonee (address _donee_contract);
    modifier onlyOwner() {
        if (msg.sender != owner) revert FundMe__NotOwner();
        _;
    }
    constructor() {
        owner = payable(msg.sender);
    }
    function pushDonee(address _user,address _doneeContract) external {
        donees.push(userAddressAndContractdAdress(_user, _doneeContract));
        emit newDonee(_doneeContract);
    }
    function killContract() external onlyOwner {
        selfdestruct(owner);
    }
    function getDonees() public view onlyOwner returns(userAddressAndContractdAdress[] memory) {
        return donees;
    }
}
