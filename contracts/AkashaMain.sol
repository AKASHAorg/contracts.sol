import 'AkashaRegistry.sol';
import 'IndexedTags.sol';
import 'AkashaBase.sol';
import 'AkashaEntry.sol';

contract AkashaMain is AkashaBase{

    AkashaRegistry _registry;
    IndexedTags _indexTags;

    event Published(address indexed profile, address entry);
    event Commented(address indexed profile, address entry);
    event Voted(address indexed profile, address entry, uint weight);

    modifier onlyRegistered(){
        if(_registry.getByAddr(msg.sender)==address(0x0)){
            throw;
        }
        _
    }

    modifier onlyEntries(){
        if(_entry[msg.sender]._date == 0){
            throw;
        }
        _
    }

    modifier checkVoteCost(int8 weight){
       if(weight<1 || weight>10){ throw;}
       uint _voteCost = voteCost * uint(weight * weight);
       if(msg.value<_voteCost){ throw;}
       _
    }

    struct MediaComponent {
        uint _date;
        bytes32[2] _hash;
    }

    struct Votes {
        address[] _votes;
        uint _votesSum;
        int32 _votesCount;
        mapping(address => int8) _vote;
    }

    struct Comment {
        address _owner;
        MediaComponent _data;
    }

    // Entry address => Entry
    mapping(address => MediaComponent) _entry;
    mapping(address => Votes) _entryVotes;
    mapping(address => Comment[]) _entryComments;

    uint constant voteCost = 1 finney;

    // Profile address => Entry address[]
    mapping(address => address[]) _entriesOfAddress;

    function AkashaMain(address registryAddress, address indexAddress){
        _registry = AkashaRegistry(registryAddress);
        _indexTags = IndexedTags(indexAddress);
        _owner = msg.sender;
    }

    function publish(bytes32[2] hash, bytes32[] tags) onlyRegistered(){
        var profile = _registry.getByAddr(msg.sender);
        var newEntry = new AkashaEntry(address(this), profile);
        if(newEntry!=address(0x0)){
           _entry[newEntry] = MediaComponent({_date: now, _hash: hash});
           _entriesOfAddress[profile].push(newEntry);
           Published(profile, newEntry);
        }else{
            Error(bytes32('main:publish'), bytes32('failed'));
        }
    }

    function upVote(address entryAddress, int8 weight) onlyRegistered() checkVoteCost(weight){
        var profile = _registry.getByAddr(msg.sender);
        if(_entryVotes[entryAddress]._vote[profile]!=0){ throw;}
        if(AkashaEntry(entryAddress).send(msg.value)){
            _entryVotes[entryAddress]._votes.push(profile);
            _entryVotes[entryAddress]._vote[profile] = weight;
            _entryVotes[entryAddress]._votesSum = _entryVotes[entryAddress]._votesSum + uint(weight);
            _entryVotes[entryAddress]._votesCount = _entryVotes[entryAddress]._votesCount + 1;
            Voted(profile, entryAddress, uint(weight));
        }else{
        throw;
        }
    }

    function downVote(address entryAddress, int8 weight) onlyRegistered() checkVoteCost(weight){
        var profile = _registry.getByAddr(msg.sender);
        if(_entryVotes[entryAddress]._vote[profile]!=0){ throw;}
        _entryVotes[entryAddress]._votes.push(profile);
        _entryVotes[entryAddress]._vote[profile] = -weight;
        _entryVotes[entryAddress]._votesSum = _entryVotes[entryAddress]._votesSum + uint(-weight);
        _entryVotes[entryAddress]._votesCount = _entryVotes[entryAddress]._votesCount + 1;
        Voted(profile, entryAddress, uint(-weight));
    }

    function getVoteOf(address profile, address entryAddress) constant returns(int8){
        return _entryVotes[entryAddress]._vote[profile];
    }

    function openedToVotes(address entryAddress) constant returns(bool){
        if(now > voteEndDate(entryAddress)){ return false;}
        return true;
    }


    function voteEndDate(address entryAddress) constant returns(uint){
        var endDate = _entry[entryAddress]._date + 6 days;
        return endDate;
    }

    function canWithDraw() onlyEntries() external returns(bool){
        return !openedToVotes(msg.sender);
    }

    function getScoreOf(address entryAddress) constant returns(uint){
        var score = _entryVotes[entryAddress]._votesSum * (
        uint(_entryVotes[entryAddress]._votesCount * _entryVotes[entryAddress]._votesCount)/2 + 1);
        return score;
    }

}
