import 'AkashaRegistry.sol';
import 'IndexedTags.sol';
import 'AkashaBase.sol';
import 'AkashaEntry.sol';
import 'AkashaProfile.sol';

contract AkashaMain is AkashaBase{
    AkashaRegistry _registry;
    IndexedTags _indexTags;

    event Published(address indexed profile, address entry);
    event Commented(address indexed profile, address entry);
    event Voted(address indexed profile, address entry, uint weight);

    modifier onlyRegistered()
    {
        if(_registry.getByAddr(msg.sender)==address(0x0)){
            throw;
        }
        _
    }

    modifier onlyEntries()
    {
        if(_entry[msg.sender]._date == 0)
        {
            throw;
        }
        _
    }

    modifier checkVoting(address entryAddress)
    {
        if(!openedToVotes(entryAddress)){ throw;}
        _
    }

    modifier checkVoteCost(int8 weight, bool isEntry)
    {
        uint baseCost;
       if(weight<1 || weight>10){ throw;}
       if(isEntry){
        baseCost = voteEntryCost;
       }
       else
       {
        baseCost = voteCommentCost;
       }
       uint _voteCost = baseCost * uint(weight * weight);
       if(msg.value<_voteCost){ throw;}
       _
    }

    struct MediaComponent {
        uint _date;
        bytes32[2] _hash;
        address _owner;
    }

    struct Votes {
        address[] _votes;
        uint _votesSum;
        int32 _votesCount;
        mapping(address => int8) _vote;
    }

    // Profile followers
    mapping(address => address[]) _following;
    mapping(address => address[]) _followers;

    // Entry address => Entry
    mapping(address => MediaComponent) _entry;
    mapping(address => Votes) _entryVotes;
    mapping(address => MediaComponent[]) _entryComments;
    mapping(address => mapping(uint => Votes)) _entryCommentVotes;

    uint constant voteEntryCost = 1 finney;
    uint constant voteCommentCost = 100 szabo;
    address _faucetAddress;
    address _fundsAddress;

    // Profile address => Entry address[]
    mapping(address => address[]) _entriesOfAddress;

    function AkashaMain(address registryAddress, address indexAddress, address faucetAddress,
    address fundsAddress)
    {
        _registry = AkashaRegistry(registryAddress);
        _indexTags = IndexedTags(indexAddress);
        _faucetAddress = faucetAddress;
        _fundsAddress = fundsAddress;
        _owner = msg.sender;
    }

    function follow(address profile)
    onlyRegistered()
    {
        var me = _registry.getByAddr(msg.sender);
        if(_registry.getByAddr(profile)==address(0x0)){
            throw;
        }
        _following[me].push(profile);
        _followers[profile].push(me);
    }

    function getFollowingCount(address profile)
    constant returns(uint)
    {
        return _following[profile].length;
    }

    function getFollowersCount(address profile)
    constant returns(uint)
    {
        return _followers[profile].length;
    }

    function getFollowingAt(address profile, uint position)
    constant returns(address)
    {
        return _following[profile][position];
    }

    function getFollowerAt(address profile, uint position)
    constant returns(address)
    {
        return _followers[profile][position];
    }


    // =================================== Start Entry AREA ==========================
    function publishEntry(bytes32[2] hash, bytes32[] tags)
    onlyRegistered()
    {
        var profile = _registry.getByAddr(msg.sender);
        var newEntry = new AkashaEntry(address(this), profile);
        if(newEntry!=address(0x0)){
           _entry[newEntry] = MediaComponent({_date: now, _hash: hash, _owner: profile});
           _entriesOfAddress[profile].push(newEntry);
           IndexedTags(_indexTags).indexEntry(newEntry, tags);
           Published(profile, newEntry);
        }
        else
        {
            Error(bytes32('main:publish'), bytes32('failed'));
        }
    }

    function updateEntry(bytes32[2] hash, address entryAddress)
    onlyRegistered()
    {
        var profile = _registry.getByAddr(msg.sender);
        if(_entry[entryAddress]._owner == profile){
            _entry[entryAddress]._hash = hash;
        }
    }

    function getEntry(address entryAddress)
    constant returns (uint, address, bytes32[2])
    {
        return (_entry[entryAddress]._date, _entry[entryAddress]._owner, _entry[entryAddress]._hash);
    }

    function getEntriesCount(address profile)
    constant returns(uint)
    {
        return _entriesOfAddress[profile].length;
    }

    function getEntryOf(address profile, uint position)
    constant returns (uint, address, bytes32[2])
    {
        return getEntry(_entriesOfAddress[profile][position]);
    }

    // ===================================== End Entry AREA ==========================

    // =================== START Entry VOTES AREA ============================
    function upVoteEntry(address entryAddress, int8 weight)
    onlyRegistered()
    checkVoteCost(weight, true)
    checkVoting(entryAddress)
    {
        var profile = _registry.getByAddr(msg.sender);
        if(_entryVotes[entryAddress]._vote[profile]!=0){ throw;}
        if(entryAddress.send(msg.value)){
            _entryVotes[entryAddress]._votes.push(profile);
            _entryVotes[entryAddress]._vote[profile] = weight;
            _entryVotes[entryAddress]._votesSum = _entryVotes[entryAddress]._votesSum + uint(weight);
            _entryVotes[entryAddress]._votesCount = _entryVotes[entryAddress]._votesCount + 1;
            Voted(profile, entryAddress, uint(weight));
        }
        else
        {
            throw;
        }
    }

    function downVoteEntry(address entryAddress, int8 weight)
    onlyRegistered()
    checkVoteCost(weight, true)
    checkVoting(entryAddress)
    {
        var profile = _registry.getByAddr(msg.sender);
        if(_entryVotes[entryAddress]._vote[profile]!=0){ throw;}
        if(_faucetAddress.send(msg.value))
        {
            _entryVotes[entryAddress]._votes.push(profile);
            _entryVotes[entryAddress]._vote[profile] = -weight;
            _entryVotes[entryAddress]._votesSum = _entryVotes[entryAddress]._votesSum + uint(-weight);
            _entryVotes[entryAddress]._votesCount = _entryVotes[entryAddress]._votesCount + 1;
            Voted(profile, entryAddress, uint(-weight));
        }
        else
        {
            throw;
        }
    }

    function getVoteOf(address profile, address entryAddress)
    constant returns(int8)
    {
        return _entryVotes[entryAddress]._vote[profile];
    }

    function openedToVotes(address entryAddress)
    constant returns(bool)
    {
        if(now > voteEndDate(entryAddress)){ return false;}
        return true;
    }

    function voteEndDate(address entryAddress)
    constant returns(uint)
    {
        var endDate = _entry[entryAddress]._date + 6 days;
        return endDate;
    }

    function canWithDraw() onlyEntries()
    external returns(bool)
    {
        return !openedToVotes(msg.sender);
    }

    function getScoreOfEntry(address entryAddress)
    constant returns(uint)
    {
        var score = _entryVotes[entryAddress]._votesSum * (
        uint(_entryVotes[entryAddress]._votesCount * _entryVotes[entryAddress]._votesCount)/2 + 1);
        return score;
    }

    function getFundsAddress()
    constant returns(address)
    {
        return _fundsAddress;
    }
    // =================== END Entry VOTES AREA ============================


    // ================ START Comments AREA ======================
    function saveComment(address entry, bytes32[2] hash)
    onlyRegistered()
    {
        var poster = _registry.getByAddr(msg.sender);
        _entryComments[entry].push(MediaComponent({_date: now, _hash: hash, _owner: poster}));
        Commented(poster, entry);
    }

    function updateComment(address entry, uint commentId, bytes32[2] hash)
    onlyRegistered()
    returns(bool)
    {
        var poster = _registry.getByAddr(msg.sender);
        if(_entryComments[entry][commentId]._owner!=poster){ return false; }
        _entryComments[entry][commentId]._hash = hash;
    }

    function getCommentsCount(address entry)
    constant returns(uint)
    {
        return _entryComments[entry].length;
    }

    function getCommentAt(address entry, uint commentId)
    constant returns(uint date, address poster, bytes32[2] hash)
    {
        MediaComponent comment = _entryComments[entry][commentId];
        return (comment._date, comment._owner, comment._hash);
    }
    // ================ END Comments AREA ======================

    // ==================== START Comment Votes AREA =============
    function upVoteComment(address entryAddress, int8 weight, uint commentId)
    onlyRegistered()
    checkVoteCost(weight, false)
    checkVoting(entryAddress)
    {
        if(_entryComments[entryAddress][commentId]._date == 0){ throw;}
        var profile = _registry.getByAddr(msg.sender);
        address collector = AkashaProfile(_entryComments[entryAddress][commentId]._owner)
        .getCollector();
        if(collector == address(0x0)){ throw;}
        _entryCommentVotes[entryAddress][commentId]._votes.push(profile);
        _entryCommentVotes[entryAddress][commentId]._vote[profile] = weight;
        _entryCommentVotes[entryAddress][commentId]._votesSum =
        _entryCommentVotes[entryAddress][commentId]._votesSum + uint(weight);
        _entryCommentVotes[entryAddress][commentId]._votesCount =
        _entryCommentVotes[entryAddress][commentId]._votesCount + 1;
        if(collector.send(msg.value))
        {
            Voted(profile, entryAddress, uint(weight));
        }
        else
        {
            throw;
        }
    }
    function downVoteComment(address entryAddress, int8 weight, uint commentId)
    onlyRegistered()
    checkVoteCost(weight, false)
    checkVoting(entryAddress)
    {
        var profile = _registry.getByAddr(msg.sender);
        if(_entryComments[entryAddress][commentId]._date == 0){ throw;}
        _entryCommentVotes[entryAddress][commentId]._votes.push(profile);
        _entryCommentVotes[entryAddress][commentId]._vote[profile] = -weight;
        _entryCommentVotes[entryAddress][commentId]._votesSum =
        _entryCommentVotes[entryAddress][commentId]._votesSum + uint(-weight);
        _entryCommentVotes[entryAddress][commentId]._votesCount =
        _entryCommentVotes[entryAddress][commentId]._votesCount + 1;
        if(_faucetAddress.send(msg.value))
        {
            Voted(profile, entryAddress, uint(-weight));
        }
    }

    function getScoreOfComment(address entryAddress, uint commentId)
    constant returns(uint)
    {
        uint score = _entryCommentVotes[entryAddress][commentId]._votesSum * (
        uint(_entryCommentVotes[entryAddress][commentId]._votesCount *
        _entryCommentVotes[entryAddress][commentId]._votesCount)/2 + 1);
        return score;
    }
    // ==================== END Comment Votes Area ================

}
