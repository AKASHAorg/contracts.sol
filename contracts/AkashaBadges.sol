contract AkashaBadges{
    address _creator;

    mapping(bytes32 => bytes32[2]) _badge;
    bytes32[] public _knownBadges;

    function AkashaBadges(){
     _creator = msg.sender;
    }
    modifier onlyCreator{
      if(msg.sender!=_creator){ throw; }
      _
    }

    function getBadge(bytes32 id) constant returns(bytes32 first, bytes32 second){
       return (_badge[id][0], _badge[id][1]);
    }

    function badgeExists(bytes32 id) constant returns(bool){
       return _badge[id][0]!=bytes32(0x0);
    }

    function createBadge(bytes32 id, bytes32[2] hash) onlyCreator returns(bool){
        if(badgeExists(id)) {
            return false;
        }
        _badge[id] = hash;
        _knownBadges.push(id);
         return true;
    }

    function destroy() onlyCreator{
        selfdestruct(_creator);
    }

    function(){throw;}
}
