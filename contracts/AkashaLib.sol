import "../solidity-stringutils/strings.sol";

contract AkashaLib {
    using strings for *;

    address _creator;
    function AkashaLib(){
     _creator = msg.sender;
    }

    function getIpfs(bytes32 first, bytes32 second) constant returns(string){
         return first.toSliceB32().concat(second.toSliceB32());
    }

    function bytes32ToString(bytes32 chunk) constant returns(string){
        return chunk.toSliceB32().toString();
    }

    function destroy(){
        if(msg.sender != _creator){ throw;}
        suicide(_creator);
    }

    function(){ throw;}
}
