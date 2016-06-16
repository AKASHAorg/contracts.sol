import 'AkashaRegistry.sol';
import 'IndexedTags.sol';
import 'AkashaBase.sol';

contract AkashaMain is AkashaBase{

    AkashaRegistry _registry;
    IndexedTags _indexTags;

    struct Comment {
       address _owner;
       uint date;
       bytes32[2] hash;
       mapping(address => int8) _vote;
       address[] _votes;
    }

    modifier onlyRegistered(){
      if(_registry.getByAddr(msg.sender)==address(0x0)){
          throw;
       }
      _
    }

    struct Entry {
        // sum(weights)*((x^2)/2 +1)
        address _owner;
        uint date;
        bytes32[2] hash;
        uint totalValue;
        mapping(address => int8) _vote;
        address[] _votes;
        Comment[] _comments;
    }

    mapping(address => Entry) _entry;

    function AkashaMain(address registryAddress, address indexAddress){
        _registry = AkashaRegistry(registryAddress);
        _indexTags = IndexedTags(indexAddress);
        _owner = msg.sender;
    }


}
