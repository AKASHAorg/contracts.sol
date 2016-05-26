import 'dapple/test.sol';
import 'AkashaRegistry.sol';

// Deriving from `Test` marks the contract as a test and gives you access to various test helpers.
contract AkashaRegistryTest is Test {
    AkashaRegistry reg;
    Tester proxy_tester;
    function setUp() {
        reg = new AkashaRegistry();
        proxy_tester = new Tester();
        proxy_tester._target(reg);
    }
    function testCreatorIsCreator() {
        assertEq( address(this), reg._creator() );
    }
    function testRegister() {
        assertEq(reg.exists("John Doe"), false);
        AkashaRegistry(proxy_tester).register("John Doe");
        assertEq(reg.exists("John Doe"), true);
    }
}