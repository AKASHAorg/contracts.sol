import 'dapple/test.sol';
import 'AkashaLib.sol';
import "../solidity-stringutils/strings.sol";

contract AkashaLibTest is Test {
    using strings for *;
    AkashaLib helpers;

    function setUp() {
        helpers = new AkashaLib();
    }
}