import 'dapple/test.sol';
import 'AkashaProfile.sol';
import "../solidity-stringutils/strings.sol";

contract AkashaProfileTest is Test {
    using strings for *;
    AkashaProfile myProfile;
    function setUp() {
        myProfile = new AkashaProfile(address(this));
    }

    function testHash() logs_gas {
        myProfile.setHash([bytes32("QmVtoCDn6SPn6vqUZnhZjTU"), bytes32("1B1pbzLAbyTu2EukJMrRGPZ")]);
        myProfile.setEthAddress(address(this));
        assertEq(myProfile.getCollector(), address(this));
    }

}
