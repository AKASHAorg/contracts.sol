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
    event Register(bytes32 indexed key,address contr);
    event Error(bytes32 indexed method, bytes32 reason);

    function testRegister() logs_gas {
        Register("John_Doe", address(0x0));
        assertFalse(reg.hasProfile("John_Doe"));
        AkashaRegistry(proxy_tester).register("John_Doe", [bytes32("QmVtoCDn6SPn6vqUZnhZjTU"),
        bytes32("1B1pbzLAbyTu2EukJMrRGPZ")]);
        assertTrue(reg.hasProfile("John_Doe"));

        // registry mapping point to the same contract address
        assertEq(reg.getById("John_Doe"), reg.getByAddr(address(proxy_tester)));
    }

    function testUnregister() {
        assertEq(AkashaRegistry(proxy_tester).getMyProfile(), reg.getById("John_Doe"));
        assertFalse(reg.unregister());
        assertTrue(AkashaRegistry(proxy_tester).unregister());
    }

    function testEvents(){
        expectEventsExact(reg);
        assertTrue(reg.register("John_Doe1", [bytes32("QmVtoCDn6SPn6vqUZnhZjTU"),
        bytes32("1B1pbzLAbyTu2EukJMrRGPZ")]));
        Register("John_Doe1", reg.getById("John_Doe1"));

        assertFalse(reg.register("John_Doe1", [bytes32("QmVtoCDn6SPn6vqUZnhZjTU"),
        bytes32("1B1pbzLAbyTu2EukJMrRGPZ")]));
        Error(bytes32('Registry:register'), bytes32('hasProfile'));
    }
}
