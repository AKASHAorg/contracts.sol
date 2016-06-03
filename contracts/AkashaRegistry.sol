import 'AkashaProfile.sol';

contract AkashaRegistry {
    address public _creator;
    // id => contract addr
    mapping(bytes32=>address) _profile;
    // sha3(msg.sender) => id
    mapping(bytes32=>bytes32) _link;
    event Register(bytes32 indexed id, address contr);

    // set creator when deployed
    function AkashaRegistry() {
        _creator = msg.sender;
    }

    // register new Profile
    function register(bytes32 name) {
        if(hasProfile(name)){ throw;}
        _profile[name] = new AkashaProfile(msg.sender, address(this));
        _link[sha3(msg.sender)] = name;
        Register(name, _profile[name]);
    }

    // remove msg.sender Profile from Registrar
    function unregister() external returns(bool){
        var key = sha3(msg.sender);
        if(hasProfile(_link[key])){
            delete _profile[_link[key]];
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
            return _profile[_link[sha3(addr)]];
    }

    function getMyProfile() constant returns(address){
        return getByAddr(msg.sender);
    }

    function destroy(){
        if(msg.sender != _creator){
            throw;
        }
        suicide(_creator);
    }

     function(){throw;}
}