library AkashaLib {

 function getIpfs(bytes23[2] _chunks) returns(string){
         bytes memory bytesString = new bytes(2 * 23);
         uint urlLength;
         for (uint i=0; i<2; i++) {
             for (uint j=0; j<23; j++) {
                 byte char = byte(bytes32(uint(_chunks[i]) * 2 ** (8 * j)));
                 if (char != 0) {
                     bytesString[urlLength] = char;
                     urlLength += 1;
                 }
             }
         }
         bytes memory bytesStringTrimmed = new bytes(urlLength);
         for (i=0; i<urlLength; i++) {
             bytesStringTrimmed[i] = bytesString[i];
         }
         return string(bytesStringTrimmed);
     }
}