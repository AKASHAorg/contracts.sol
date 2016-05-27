import 'AkashaRegistry.sol';
import "../solidity-stringutils/strings.sol";

contract AkashaProfile {
    using strings for *;
    address public _owner;
    address public _ethAddress;
    string _fullName;

    bytes32[2] _hash;
    AkashaRegistry registrar;

    event UpdateInfo();

    modifier onlyOwner{
        if(msg.sender==_owner){ _ }
    }

    function AkashaProfile(address owner){
        _owner = owner;
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

    function updateHash(bytes32[2] chunks) onlyOwner{
        _hash = chunks;
        UpdateInfo();
    }

    function removeProfile() onlyOwner{
        var unlist = registrar.unregister();
        if(unlist){
           suicide(msg.sender);
        }
    }

    function(){ throw;}

}