contract AkashaFunds{
    address _owner;

    function AkashaFunds(){
        _owner = msg.sender;
    }

    function withDraw(uint amount) returns(bool){
        if(msg.sender!=_owner){ throw;}
        if(amount > this.balance) {
            return _owner.send(this.balance);
        }
        return _owner.send(amount);
    }
}
