import 'IndexedTags.sol';

contract AkashaMain {
    address _creator;
    bytes32[2] _hash;

    modifier onlyCreator{
      if(msg.sender!=_creator){ throw; }
      _
    }

    struct Entry {
        address _owner;
        bytes32[2] _hash;

        // sum(weights)*((x^2)/2 +1)
        mapping(address => int8) _vote;
        address[] votes;
    }

    struct Comment {
        address _owner;
        bytes32[2] _hash;
        mapping(address => int8) _vote;
        address[] votes;
    }

    function AkashaEntry(bytes32[2] hash, bytes32[] tags) {
        _creator = msg.sender;
        _hash = hash;
        IndexedTags(0x3d1358cf4d024120ae19002822228344c61e394f).indexEntry(tags);
    }


}
