import "AkashaRegistry.sol";
contract Registered {
  address _creator;

  AkashaRegistry  _registry;

  modifier onlyCreator{
     if(msg.sender!=_creator){ throw; }
     _
  }

}
