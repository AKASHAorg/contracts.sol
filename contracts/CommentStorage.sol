import 'AkashaStorage.sol';

contract CommentStorage is AkashaStorage{
    // Entry address => Comments[]
    mapping(address => MediaComponent[]) _entryComments;

    function saveComment(address poster, address entry, bytes32[2] hash) auth(){
        MediaComponent comment = MediaComponent({_date: now, _hash: hash, _owner: poster});
        _entryComments[entry].push(comment);
    }

    function updateComment(address poster, address entry, uint commentId) auth() returns(bool){
        if(_entryComments[entry][commentId]._owner!=poster){ return false; }

    }

    function getCommentsCount(address entry) constant returns(uint){
        return _entryComments[entry].length;
    }

    function getCommentAt(address entry, uint commentId) constant returns(uint date, address
    poster, bytes32[2] hash){
        MediaComponent comment = _entryComments[entry][commentId];
        return (comment._date, comment._owner, comment._hash);
    }

}
