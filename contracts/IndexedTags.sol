import "AkashaTags.sol";
import "AkashaRegistry.sol";
import "AkashaMain.sol";
import "AkashaBase.sol";

contract IndexedTags is AkashaBase {
    address _akashaMain;

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
        _owner = msg.sender;
        _tags = AkashaTags(tags);
        _registry = AkashaRegistry(registry);
    }

    function setMain(address mainAddress) auth(){
        if(_akashaMain!=address(0x0)){
            _akashaMain = mainAddress;
        }
    }

    function indexEntry(address entryAddr, bytes32[] tag) returns(bool){
        if(msg.sender!=_akashaMain){ throw;}
        for(uint i = 0; i < tag.length; i++) {
            if(!_tags.exists(tag[i])){
                Error(bytes32('Tag:index'), bytes32('indexEntry'));
                return false;
            }
            cursor[_tags.getTagId(tag[i])].entries.push(entryAddr);
            IndexedTag(_tags.getTagId(tag[i]), entryAddr);
        }
        return true;
    }

    function subscribe(bytes32 tag) returns(bool){
        var tagId = _tags.getTagId(tag);
        var profile = _registry.getByAddr(msg.sender);
        if(profile==address(0x0) || !_tags.exists(tag) || isSubscribed(profile, tagId)){
            Error(bytes32('Tag:subscribe'), bytes32('isSubscribed'));
            return false;
        }
        subscriptions[profile].push(tagId);
        cursor[tagId].totalSubs++;
        return true;
    }

    function unsubscribe(bytes32 tag, uint subPosition) returns(bool){
        var tagId = _tags.getTagId(tag);
        var profile = _registry.getByAddr(msg.sender);
        if(!_tags.exists(tag)){
            Error(bytes32('Tag:unsubscribe'), bytes32('tag!Exist'));
            return false;
        }
        if(subscriptions[profile][subPosition]!= tagId) {
            Error(bytes32('Tag:unsubscribe'), bytes32('notSubscribed'));
            return false;
        }
        delete subscriptions[profile][subPosition];
        cursor[tagId].totalSubs--;
        return true;
    }

    function isSubscribed(address subscriber, uint tagId) constant returns(bool){
        for(uint i=0; i< subscriptions[subscriber].length; i++){
            if(subscriptions[subscriber][i] == tagId){
                return true;
            }
        }
        return false;
    }

    function getSubPosition(address subscriber, uint tagId) constant returns(uint){
        for(uint i=0; i< subscriptions[subscriber].length; i++){
            if(subscriptions[subscriber][i] == tagId){
                return i;
            }
        }
    }

    function(){throw;}
}
