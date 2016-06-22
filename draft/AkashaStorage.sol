import 'AkashaBase.sol';

contract AkashaStorage is AkashaBase{

    struct MediaComponent {
        uint _date;
        bytes32[2] _hash;
        address _owner;
    }

    function AkashaStorage(address owner){
        _owner = owner;
    }

}
