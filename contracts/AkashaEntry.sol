import 'AkashaMain.sol';
import 'AkashaBase.sol';
import 'AkashaProfile.sol';

contract AkashaEntry is AkashaBase {

    uint totalValue;
    bytes32[2] _hash;
    address _manager;

    function AkashaEntry(bytes32[2] hash, address manager, address owner) {
        _owner = owner;
        _hash = hash;
        _manager = manager;
    }

    function withDraw() auth() returns(bool){
        if(AkashaMain(_manager).canWithDraw()){
            Error(bytes32('withDraw'), bytes32('notEligible'));
            return false;
        }
        selfdestruct(AkashaProfile(_owner).getCollector());
        return true;
    }

}
