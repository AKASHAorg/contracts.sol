## Repo for ethereum contracts used by Akasha

### Example:
```javascript
const AkashaContract = require('./build/js_module').class;
const web3 = web3Instance // get a web3 instance;
const registrar = new AkashaContract(web3).objects.registry;
```

![Diagram](diagram.png?raw=true "Contracts")
