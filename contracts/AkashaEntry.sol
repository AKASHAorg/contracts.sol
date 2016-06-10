contract AkashaEntry {

  bytes32[2] _hash;
  address _creator;

  function AkashaEntry(bytes32[2] hash, bytes32[] tags) {
    _creator = msg.sender;
    _hash = hash;
  }

}
