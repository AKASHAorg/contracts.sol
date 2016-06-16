import 'AkashaBase.sol';
import 'AkashaRegistry.sol';

contract AkashaProfile is AkashaBase{
    address _ethAddress;
    bytes32[2] _hash;

    AkashaRegistry registrar;

    event UpdateInfo();

    // Set contract owner and Registrar contract from address
    function AkashaProfile(address owner, address registrar, bytes32[2] chunks){
        _owner = owner;
        _hash = chunks;
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
    function setEthAddress(address newAddr) auth(){
        _ethAddress = newAddr;
    }

    // Get ipfs hash for profile data
    function getIpfs() constant returns(bytes32 chunk1, bytes32 chunk2){
        return (_hash[0], _hash[1]);
    }

    // Set ipfs hash for profile
    function setHash(bytes32[2] chunks) auth(){
        _hash = chunks;
        UpdateInfo();
    }

    // Unlist from registrar and suicide contract
    function destroy() auth(){
        var unlist = registrar.unregister();
        if(unlist){
           selfdestruct(_owner);
        }
    }

    function(){ throw;}

}
