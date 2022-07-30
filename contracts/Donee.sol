// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
error InsufficientBalance(uint256 required);
contract Donee {

    address private immutable i_owner;
    uint public constant MINIMUN_USD = 0.01 ether;
    address[] private s_donors;
    mapping(address => uint256) private s_addressToAmountDonated;

    constructor(){
        i_owner = msg.sender;
    }
    function donate() public payable {
        if(msg.value < MINIMUN_USD){ 
            revert InsufficientBalance({
            required: MINIMUN_USD
            });
        }
    }
    function getAddressAmountDonated(address _donor) internal view returns (uint256) {
        return s_addressToAmountDonated[_donor];
    }
}
