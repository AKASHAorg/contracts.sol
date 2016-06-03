import 'dapple/test.sol';
import 'AkashaProfile.sol';
import 'AkashaRegistry.sol';
import "../solidity-stringutils/strings.sol";

contract AkashaProfileTest is Test {
    using strings for *;
    AkashaProfile myProfile;
    AkashaRegistry registrar;
    function setUp() {
        registrar = new AkashaRegistry();
        registrar.register('costel1');
        myProfile = AkashaProfile(registrar.getByAddr(address(this)));
    }

    function testHash() logs_gas {
        myProfile.setHash([bytes32("QmVtoCDn6SPn6vqUZnhZjTU"), bytes32("1B1pbzLAbyTu2EukJMrRGPZ")]);
        myProfile.setEthAddress(address(this));
        assertEq(myProfile.getCollector(), address(this));
    }

}
