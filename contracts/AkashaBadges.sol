contract AkashaBadges{
    address _creator;

    struct Badge{
    bytes32 title;
    bytes32[2] hash;
    }

    function AkashaBadges(){
     _creator = msg.sender;
    }

    function destroy(){
        if(msg.sender == _creator){ suicide(_creator);}
    }

    function(){throw;}
}