import 'dapple/test.sol';
import 'AkashaProfile.sol';
import 'AkashaRegistry.sol';
import "../solidity-stringutils/strings.sol";

contract AkashaProfileTest is Test {
    using strings for *;
    AkashaProfile myProfile;
    AkashaRegistry registrar;
    Tester proxy_tester;
    event UpdateInfo();
    function setUp() {
        registrar = new AkashaRegistry();
        proxy_tester = new Tester();
        proxy_tester._target(registrar);
        registrar.register('costel1', [bytes32("QmVtoCDn6SPn6vqUZnhZjTU"), bytes32("1B1pbzLAbyTu2EukJMrRGPZ")]);
        myProfile = AkashaProfile(registrar.getByAddr(address(this)));
    }

    function testHash() {
        expectEventsExact(myProfile);
        var (a, b) = (bytes32("QmVtoCDn6SPn6vqUZnhZjTU"),  bytes32("1B1pbzLAbyTu2EukJMrRGPZ"));
        myProfile.setHash([a, b]);
        UpdateInfo();
    }

    function testCollector(){
        assertEq(myProfile.getCollector(), address(this));
        myProfile.setEthAddress(address(123));
        assertEq(myProfile.getCollector(), address(123));
    }

}
