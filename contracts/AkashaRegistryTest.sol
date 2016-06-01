import 'dapple/test.sol';
import 'AkashaRegistry.sol';

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
    event Register(bytes32 indexed key,address contr);
    function testRegister() {
        Register("John_Doe", address(0x0));

        assertFalse(reg.hasProfile("John_Doe"));
        AkashaRegistry(proxy_tester).register("John_Doe");
        assertTrue(reg.hasProfile("John_Doe"));

        // registry mapping point to the same contract address
        assertEq(reg.getById("John_Doe"), reg.getByAddr(address(proxy_tester)));
    }

    function testUnregister() {
        assertEq(AkashaRegistry(proxy_tester).getMyProfile(), reg.getById("John_Doe"));
        assertFalse(reg.unregister());
        assertTrue(AkashaRegistry(proxy_tester).unregister());
    }
}