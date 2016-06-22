import 'dapple/test.sol';
import 'AkashaMain.sol';

contract AkashaMainTest is Test {
    AkashaMain akashaMain;
    Tester proxy_tester;
    function setUp() {
        akashaMain = new AkashaMain(address(0x0), address(0x0), address(0x0), address(0x0));
        proxy_tester = new Tester();
        proxy_tester._target(akashaMain);
    }
    function testDeploy() logs_gas {
        var deploy = new AkashaMain(address(0x0), address(0x0), address(0x0), address(0x0));
        log_address(address(this));
    }
}
