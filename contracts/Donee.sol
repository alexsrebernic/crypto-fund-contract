// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

error InsufficientBalance(uint256 required);
error FundMe__NotOwner();

import "./Donations.sol";
contract Donee {
    address private immutable i_owner;
    uint public constant MINIMUN_USD = 0.01 ether;
    address[] private s_donors;
    mapping(address => uint256) private s_addressToAmountDonated;
    address public constant DONATIONS_CONTRACT = 0x8016619281F888d011c84d2E2a5348d9417c775B;
    DonationsInterface DonationsContract = DonationsInterface(DONATIONS_CONTRACT);
    DataDonee public  dataDonee;

    event donation (address indexed _from, address indexed _to, uint amount);
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
    constructor(string memory _first_name, string memory _last_name, string memory _avatar_color,string memory _details, string memory _created_at){
        i_owner = msg.sender;
        dataDonee = DataDonee(
            msg.sender,
            0,
            _first_name,
            _last_name,
            _avatar_color,
            _details,
            _created_at,
            address(this)
        );
        DonationsContract.pushDonee(address(this));
    }
    function donate() public payable {
        if(msg.value < MINIMUN_USD){ 
            revert InsufficientBalance({
            required: MINIMUN_USD
            });
        }
        s_addressToAmountDonated[msg.sender] += msg.value;
        s_donors.push(msg.sender);
        dataDonee.balance += msg.value;
        emit donation(msg.sender,dataDonee.owner,msg.value);
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
    function getAddressAmountDonated(address _donor) internal view returns (uint256) {
        return s_addressToAmountDonated[_donor];
    }
    function getDataDonee() external view returns (DataDonee memory) {
        return dataDonee;
    }
}
interface DonationsInterface {
    function pushDonee(address) external ;
}