// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import './Donee.sol';
contract Factory {
    Donee[] deployedContracts;
    event newDonee(address donee);
    address public aggregatorV3Interface;
    constructor(address _aggregatorV3Interface){
        aggregatorV3Interface = _aggregatorV3Interface;
    }
    function createNewDonee() public returns(Donee) {
        Donee d = new Donee(msg.sender, aggregatorV3Interface);
        deployedContracts.push(d);
        emit newDonee(msg.sender);
        return d;
    }
    function getDonors() public view returns (Donee[] memory){
        return deployedContracts;
    }
}