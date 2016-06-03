import 'AkashaRegistry.sol';

contract AkashaProfile {
    address _owner;
    address _ethAddress;
    string _fullName;

    bytes32[2] _hash;
    AkashaRegistry registrar;

    event UpdateInfo();

    modifier onlyOwner{
        if(msg.sender!=_owner){ throw; }
        _
    }

    // Set contract owner and Registrar contract from address
    function AkashaProfile(address owner, address registrar){
        _owner = owner;
        registrar = AkashaRegistry(registrar);
    }

    // Get address for tipping
    function getCollector() constant returns(address){
        if(_ethAddress!=address(0x0)){
            return _ethAddress;
        }
        return _owner;
    }

    // Set address for receiving tipping
    function setEthAddress(address newAddr) onlyOwner{
        _ethAddress = newAddr;
    }

    function setFullName(string fullName) onlyOwner{
        _fullName = fullName;
        UpdateInfo();
    }

    // Get ipfs hash for profile data
    function getIpfs() constant returns(bytes32 chunk1, bytes32 chunk2){
        return (_hash[0], _hash[1]);
    }

    // Set ipfs hash for profile
    function setHash(bytes32[2] chunks) onlyOwner{
        _hash = chunks;
        UpdateInfo();
    }

    // Unlist from registrar and suicide contract
    function removeProfile() onlyOwner{
        var unlist = registrar.unregister();
        if(unlist){
           suicide(_owner);
        }
    }

    function(){ throw;}

}