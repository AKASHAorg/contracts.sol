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

    function AkashaProfile(address owner){
        _owner = owner;
        registrar = AkashaRegistry(0xf225a095cdf7854d2e1cdc8b9de65a569b8f7cdb);
    }

    function getCollector() constant returns(address){
        if(_ethAddress!=address(0x0)){
            return _ethAddress;
        }
        return _owner;
    }

    function setEthAddress(address newAddr) onlyOwner{
        _ethAddress = newAddr;
    }

    function setFullName(string fullName) onlyOwner{
        _fullName = fullName;
        UpdateInfo();
    }

    function getIpfs() constant returns(bytes32 chunk1, bytes32 chunk2){
        return (_hash[0], _hash[1]);
    }

    function setHash(bytes32[2] chunks) onlyOwner{
        _hash = chunks;
        UpdateInfo();
    }

    function removeProfile() onlyOwner{
        var unlist = registrar.unregister();
        if(unlist){
           suicide(_owner);
        }
    }

    function(){ throw;}

}