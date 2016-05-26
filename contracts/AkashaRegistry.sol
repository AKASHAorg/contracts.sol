import 'AkashaProfile.sol';

contract AkashaRegistry {
    address public _creator;
    mapping(bytes32=>address) _profile;
    mapping(address=>address) _link;
    event Register(bytes32 indexed key, address value);
    function AkashaRegistry() {
        _creator = msg.sender;
    }

    function register(bytes32 key) {
        if(exists(key)){ throw;}
        _profile[key] = new AkashaProfile(msg.sender);
        _link[msg.sender] = _profile[key];
        Register(key, _link[msg.sender]);
    }

    function unregister(bytes32 name){
        if(_link[msg.sender] == _profile[name]){
            delete _profile[name];
            delete _link[msg.sender];
        }
    }

    function exists(bytes32 name) constant returns(bool exists){
        return(get(name)!=address(0x0) || _link[msg.sender]!=address(0x0));
    }
    function get(bytes32 key) constant returns (address value) {
        return _profile[key];
    }
    function(){throw;}
}