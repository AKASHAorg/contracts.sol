import 'dapple/test.sol';
import 'AkashaTags.sol';

contract AkashaTagsTest is Test {
    AkashaTags tags;
    Tester proxy_tester;
    event TagCreated(bytes32 indexed tag);
    event Error(bytes32 indexed method, bytes32 reason);

    function setUp() {
        tags = new AkashaTags();
        proxy_tester = new Tester();
        proxy_tester._target(tags);
    }

    function testAdd(){
        var tag = bytes32('cars');
        expectEventsExact(tags);
        tags.add(tag);
        TagCreated(tag);
        tags.add(tag);
        Error(bytes32('Tag:add'), bytes32('exists'));
    }

    function testAddAndGet(){
        bytes32 tag = bytes32('cars1');
        tags.add(tag);
        assertTrue(tags.exists(tag));
    }

    function testErrorDestroy(){
       tags.destroy();
       tags.getTagAt(0);
    }
}
