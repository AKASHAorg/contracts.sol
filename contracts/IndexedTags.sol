import "AkashaTags.sol";

contract IndexedTags {

    AkashaTags _tags;
    Event IndexedTag(uint tag, address entry);
    Event Subscribe
    mapping(uint => address[]) public cursor;

    function IndexedTags(){
       _owner = msg.sender;
    }

    function indexEntry(bytes32[] tag){
        for(uint i = 0; i < tag.length; i++) {
            if(!_tags.exists(tag[i])){ throw;}
            cursor[AkashaTags.getTagId(tag[i])].push(msg.sender);
            IndexedTag(tag[i], msg.sender);
        }
    }


    function destroy(){
        if(msg.sender == _owner){ suicide(_owner);}
    }

    function(){throw;}
}