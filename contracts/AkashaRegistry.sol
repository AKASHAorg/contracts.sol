import 'AkashaProfile.sol';
import "AkashaBase.sol";

contract AkashaRegistry is AkashaBase{

    // id => contract addr
    mapping(bytes32=>address) _profile;
    mapping(address=>bytes32) _ns;
    // sha3(msg.sender) => id
    mapping(bytes32=>address) _link;
    event Register(bytes32 indexed id, address contr);

    // register new Profile
    function register(bytes32 name, bytes32[2] ipfsChunks) returns(bool){
        if(hasProfile(name)){
            Error(bytes32('Registry:register'), bytes32('hasProfile'));
            return false;
        }
        _profile[name] = new AkashaProfile(msg.sender, address(this), ipfsChunks);
        _link[sha3(msg.sender)] = _profile[name];
        _ns[_profile[name]] = name;
        Register(name, _profile[name]);
        return true;
    }

    // remove msg.sender Profile from Registrar
    function unregister() external returns(bool){
        var key = sha3(msg.sender);
        if(hasProfile(_ns[_link[key]])){
            delete _profile[_ns[_link[key]]];
            delete _ns[_link[key]];
            delete _link[key];
            return true;
        }
        return false;
    }


    // check if a given Id or msg.sender address is already registered
    function hasProfile(bytes32 name) constant returns(bool exists) {
        return(getById(name)!=address(0x0) || getByAddr(msg.sender)!=address(0x0));
    }

    // get Profile contract address for a given Id
    function getById(bytes32 name) constant returns(address) {
        return _profile[name];
    }

    function getByAddr(address addr) constant returns(address) {
        return _profile[_ns[_link[sha3(addr)]]];
    }

    function getByContr(address profile) constant returns(bytes32) {
        return _ns[profile];
    }

    function getMyProfile() constant returns(address){
        return getByAddr(msg.sender);
    }

    function(){throw;}
}
