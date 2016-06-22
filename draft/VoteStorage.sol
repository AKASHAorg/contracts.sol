contract VoteStorage {

    struct Votes {
        address[] _votes;
        uint _votesSum;
        int32 _votesCount;
        mapping(address => int8) _vote;
    }

    mapping(address => Votes) _entryVotes;
    mapping(address => ())

}
