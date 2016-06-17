import 'AkashaRegistry.sol';
import 'IndexedTags.sol';
import 'AkashaBase.sol';
import 'AkashaEntry.sol';

contract AkashaMain is AkashaBase{

    AkashaRegistry _registry;
    IndexedTags _indexTags;

    struct Comment {
        address _owner;
        uint _date;
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

    modifier onlyEntries(){
        if(_entry[msg.sender].date == 0){
            throw;
        }
        _
    }

    struct Entry {
        // sum(weights)*((x^2)/2 +1)
        uint _date;
        address[] _votes;
        Comment[] _comments;
        mapping(address => int8) _vote;
    }
    // Entry address => Entry
    mapping(address => Entry) _entry;
    // Profile address => Entry address[]
    mapping(address => address[]) _entriesOfAddress;

    function AkashaMain(address registryAddress, address indexAddress){
        _registry = AkashaRegistry(registryAddress);
        _indexTags = IndexedTags(indexAddress);
        _owner = msg.sender;
    }

    function publish(bytes32[2] hash, bytes32[] tags) onlyRegistered() {
        var profile = _registry.getByAddr(msg.sender);
        var newEntry = new AkashaEntry(hash, address(this), profile);
        //@todo Struct default values
        _entry[newEntry] = regEntry;
        _entriesOfAddress[profile].push(newEntry);
    }

    function upVote(address entryAddress, uint8 weight){
        if(weight<1 || weight>10){ throw;}

    }

    function downVote(address entryAddress, int8 weight){
        if(weight>-1 || weight<-10){ throw;}
    }

    function canWithDraw() onlyEntries() external returns(bool){
        var endDate = _entry[msg.sender].date + 6 days;
        if(now > endDate){
            return true;
        }
        return false;
    }

}
