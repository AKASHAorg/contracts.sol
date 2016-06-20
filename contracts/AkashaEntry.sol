import 'AkashaMain.sol';
import 'AkashaBase.sol';
import 'AkashaProfile.sol';

contract AkashaEntry is AkashaBase {

    address _manager;
    function AkashaEntry(address manager, address owner) {
        _manager = manager;
        _owner = owner;
    }

    function withDraw() auth() returns(bool){
        if(!AkashaMain(_manager).canWithDraw()){
            Error(bytes32('withDraw'), bytes32('notEligible'));
            return false;
        }
        selfdestruct(AkashaProfile(_owner).getCollector());
        return true;
    }

}
