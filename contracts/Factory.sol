import './Donee.sol';
contract Factory {
    Donee[] deployedContracts;

    event newDonee(address donee);
    function createNewDonee(address AggregatorV3Interface) public {
        Donee d = new Donee(msg.sender, AggregatorV3Interface);
        deployedContracts.push(d);
        emit newDonee(msg.sender);
    }
}