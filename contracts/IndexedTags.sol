import "AkashaTags.sol";
import "AkashaRegistry.sol";

contract IndexedTags {
    address _creator;
    AkashaTags _tags;
    AkashaRegistry _registry;
    struct TagMeta {
     address[] entries;
     uint totalSubs;
    }
    mapping(uint => TagMeta) public cursor;
    mapping(address => uint[]) subscriptions;

    event IndexedTag(uint tag, address entry);

    function IndexedTags(address tags, address registry){
       _creator = msg.sender;
       _tags = AkashaTags(tags);
       _registry = AkashaRegistry(registry);
    }

    function indexEntry(bytes32[] tag){
        for(uint i = 0; i < tag.length; i++) {
            if(!_tags.exists(tag[i])){ throw;}
            cursor[_tags.getTagId(tag[i])].entries.push(msg.sender);
            IndexedTag(_tags.getTagId(tag[i]), msg.sender);
        }
    }

    function subscribe(bytes32 tag){
        var tagId = _tags.getTagId(tag);
        var profile = _registry.getByAddr(msg.sender);
        if(profile==address(0x0) || !_tags.exists(tag) || isSubscribed(profile, tagId)){ throw;}
        subscriptions[profile].push(tagId);
        cursor[tagId].totalSubs++;
    }

    function unsubscribe(bytes32 tag){
        var tagId = _tags.getTagId(tag);
        var profile = _registry.getByAddr(msg.sender);
        if(!_tags.exists(tag) || !isSubscribed(profile, tagId)){ throw;}
        delete subscriptions[profile][getSubPosition(profile, tagId)];
        cursor[tagId].totalSubs--;
    }

    function isSubscribed(address subscriber, uint tagId) constant returns(bool){
        for(uint i=0; i< subscriptions[subscriber].length; i++){
            if(subscriptions[subscriber][i] == tagId){
                return true;
            }
         }
         return false;
    }

    function getSubPosition(address subscriber, uint tagId) internal returns(uint){
        for(uint i=0; i< subscriptions[subscriber].length; i++){
            if(subscriptions[subscriber][i] == tagId){
                return i;
            }
         }
    }

    function destroy(){
        if(msg.sender == _creator){ suicide(_creator);}
    }

    function(){throw;}
}
