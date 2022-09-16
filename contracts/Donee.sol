// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

error InsufficientBalance(uint required);
error FundMe__NotOwner();

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
contract Donee {
    address private immutable i_owner;
    uint public MINIMUN_USD = 1 * 1e18;
    address[] public s_donors;
    mapping(address => uint256) public s_addressToAmountDonated;
    AggregatorV3Interface private immutable aggregatorV3Contract;
    string public first_name;
    string public last_name;
    string public avatar_color;
    string public details;
    uint public created_at;
    event donation( address _from, uint _amount );
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }
    constructor(string memory _firstName, string memory _lastName, string memory _avatarColor,string memory _details,address _aggregatorV3Interface){
        i_owner = msg.sender;
        first_name = _firstName;
        last_name = _lastName;
        avatar_color = _avatarColor;
        details = _details;
        created_at = block.timestamp;
        aggregatorV3Contract = AggregatorV3Interface( _aggregatorV3Interface );
    }
    function donate() public payable {
        if(getConversionRate(msg.value) < MINIMUN_USD){ 
                revert InsufficientBalance({
                required: MINIMUN_USD
            });
        }
        s_addressToAmountDonated[msg.sender] += msg.value;
        s_donors.push(msg.sender);
        emit donation(msg.sender, msg.value);
    }
    function withdraw() public onlyOwner {
        address[] memory donors = s_donors;
        for (
            uint256 funderIndex = 0;
            funderIndex < donors.length;
            funderIndex++
        ) {
            address funder = donors[funderIndex];
            s_addressToAmountDonated[funder] = 0;
        }
        s_donors = new address[](0);
        (bool success, ) = i_owner.call{value: address(this).balance}("");
        require(success);
    }
    function getPrice() internal view returns(uint256) {
        (, int256 price,,,) = aggregatorV3Contract.latestRoundData();
        return uint(price * 1e10);
    }
    function getConversionRate(uint256 ethAmount) internal view returns (uint256){
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
    function getDataDonee() external view returns ( string memory ,  string memory ,  string memory ,  string memory, uint , uint , address ) {
        return ( first_name, last_name, details, avatar_color, address(this).balance, created_at, address(this) );
    }
    function getDonors() external view returns (address[] memory){
        return s_donors;
    }
    function getDonor(uint256 index) external view returns (address){
        return s_donors[index];
    }
    function getCurrentBalance() external view returns ( uint ){
        return address(this).balance;
    }
    function getMinimunUsd() external view returns ( uint ){
        return MINIMUN_USD;
    }
    function changeMinimunUsd(uint _amount) public onlyOwner(){
        MINIMUN_USD = _amount * 1e18;
    }
}
