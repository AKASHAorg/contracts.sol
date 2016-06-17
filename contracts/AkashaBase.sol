contract AkashaBase {
    address public _owner;

    // catch errors on contract, not using throw for application level errors
    event Error(bytes32 indexed method, bytes32 reason);

    function AkashaBase(){
        _owner = msg.sender;
    }

    modifier auth {
        if (_owner != msg.sender) {
            throw;
        }
        _
    }

    function destroy() auth() {
        selfdestruct(_owner);
    }

}
