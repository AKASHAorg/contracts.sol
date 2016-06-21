import 'AkashaMain.sol';
import 'AkashaBase.sol';
import 'AkashaProfile.sol';

contract AkashaEntry is AkashaBase {

    address _manager;
    event Receiving(address _receiver, uint _amount);

    function AkashaEntry(address manager, address owner) {
        _manager = manager;
        _owner = owner;
    }

    function withDraw() auth() returns(bool){
        uint fee = this.balance/100;
        address receiver = AkashaProfile(_owner).getCollector();
        address funds = AkashaMain(_manager).getFundsAddress();

        if(!AkashaMain(_manager).canWithDraw()){
            Error(bytes32('withDraw'), bytes32('notEligible'));
            return false;
        }
        if(funds.send(fee)){
            Receiving(receiver, this.balance);
            selfdestruct(receiver);
            return true;
        }else{
            Error(bytes32('withDraw'), bytes32('feeError'));
            return false;
        }
    }

}
