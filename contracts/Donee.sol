// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

error InsufficientBalance(uint256 required);
error FundMe__NotOwner();

import "./Donations.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
contract Donee {
    address private immutable i_owner;
    uint public constant MINIMUN_USD = 1 * 1e18;
    address[] private s_donors;
    mapping(address => uint256) private s_addressToAmountDonated;
    DonationsInterface private immutable donationsContract;
    AggregatorV3Interface private immutable aggregatorV3Contract;
    DataDonee public  dataDonee;

    event donation (address indexed _from,  uint amount);
    struct DataDonee {
        address owner;
        uint  balance;
        string  first_name;
        string  last_name;
        string  avatar_color;
        string details;
        string  created_at;
        address contract_address;
    }
    modifier onlyOwner() {
        if (msg.sender != i_owner) revert FundMe__NotOwner();
        _;
    }
    constructor(string memory _firstName, string memory _lastName, string memory _avatarColor,string memory _details, string memory _createdAt,address _aggregatorV3Interface, address _donationsInterface){
        i_owner = msg.sender;
        donationsContract = DonationsInterface( _donationsInterface );
        aggregatorV3Contract = AggregatorV3Interface( _aggregatorV3Interface );
        dataDonee = DataDonee (
            msg.sender,
            0,
            _firstName,
            _lastName,
            _avatarColor,
            _details,
            _createdAt,
            address(this)
        );
        donationsContract.pushDonee( msg.sender, address(this) );
    }
    function donate() public payable {
        if(getConversionRate(msg.value) < MINIMUN_USD){ 
                revert InsufficientBalance({
                required: MINIMUN_USD
            });
        }
        s_addressToAmountDonated[msg.sender] += msg.value;
        s_donors.push(msg.sender);
        dataDonee.balance += msg.value;
        emit donation( msg.sender,  msg.value );
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
    function getConversionRate(uint256 ethAmount) public view returns (uint256){
        uint256 ethPrice = getPrice();
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
    function getAddressAmountDonated( address _donor ) internal view returns (uint256) {
        return s_addressToAmountDonated[_donor];
    }
    function getDataDonee() external view returns (DataDonee memory) {
        return dataDonee;
    }
}
interface DonationsInterface {
    function pushDonee( address, address ) external ;
}