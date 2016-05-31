contract AkashaEntry {
    address _owner;
    bytes32[2] hash;

    function AkashaEntry(){
        _owner = msg.sender;
    }

}