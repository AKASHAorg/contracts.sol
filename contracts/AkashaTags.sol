contract AkashaTags {
    address _owner;
    mapping(bytes32 => uint) _tag;
    bytes32[] _knownTags;
    uint _length = 1;

    function AkashaTags(){
        _owner = msg.sender;
    }

    function exists(bytes32 tag) constant returns(bool){
        return _tag[tag]!=0;
    }

    function add(bytes32 tag) returns(uint){
        if(exists(tag)){ throw;}
        _knownTags[_length] = tag;
        _tag[tag] = _length;
        _length++;
        return _tag[tag];
    }

    function getTagId(bytes32 tag) constant returns(uint){
        return _tag[tag];
    }

    function destroy(){
        if(msg.sender == _owner){ suicide(_owner);}
    }
    function(){throw;}
}