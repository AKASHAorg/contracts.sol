import "AkashaBase.sol";

contract AkashaTags is AkashaBase{
    mapping(bytes32 => uint) _tag;
    bytes32[] _knownTags;
    uint public _length = 1;

    event TagCreated(bytes32 indexed tag);

    function exists(bytes32 tag) constant returns(bool){
        return _tag[tag]!=0;
    }

    function add(bytes32 tag) returns(uint){
        if(exists(tag)){
            Error(bytes32('Tag:add'), bytes32('exists'));
            return 0;
        }
        _knownTags.push(tag);
        _tag[tag] = _length;
        _length++;

        TagCreated(tag);
        return _tag[tag];
    }

    function getTagAt(uint position) constant returns(bytes32){
        return _knownTags[position];
    }

    function getTagId(bytes32 tag) constant returns(uint){
        return _tag[tag];
    }

    function(){throw;}
}
