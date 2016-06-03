'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['contracts'] = (function builder () {
  var environments = {
      'default': {
        'objects': {
          'akashaLib': {
            'class': 'AkashaLib',
            'address': '0x4da189c2891f46cc266c98f341c45ac027223951'
          },
          'registry': {
            'class': 'AkashaRegistry',
            'address': '0xf416aee89c245fd7fe4e7141a19601055b7cc33c'
          },
          'akashaTags': {
            'class': 'AkashaTags',
            'address': '0x6b495143665763101d13f9ec71635543748795dc'
          },
          'indexedTags': {
            'class': 'IndexedTags',
            'address': '0x3f4908343830f1cf6c07fc399ee0a4ae132ac5df'
          }
        }
      }
    };

  function ContractWrapper (headers, _web3) {
    if (!_web3) {
      throw new Error('Must supply a Web3 connection!');
    }

    this.headers = headers;
    this._class = _web3.eth.contract(headers.interface);
  }

  ContractWrapper.prototype.deploy = function () {
    var args = new Array(arguments);
    args[args.length - 1].data = this.headers.bytecode;
    return this._class.new.apply(this._class, args);
  };

  var passthroughs = ['at', 'new'];
  for (var i = 0; i < passthroughs.length; i += 1) {
    ContractWrapper.prototype[passthroughs[i]] = (function (passthrough) {
      return function () {
        return this._class[passthrough].apply(this._class, arguments);
      };
    })(passthroughs[i]);
  }

  function constructor (_web3, env) {
    if (!env) {
      env = {
      'objects': {
        'akashaLib': {
          'class': 'AkashaLib',
          'address': '0x4da189c2891f46cc266c98f341c45ac027223951'
        },
        'registry': {
          'class': 'AkashaRegistry',
          'address': '0xf416aee89c245fd7fe4e7141a19601055b7cc33c'
        },
        'akashaTags': {
          'class': 'AkashaTags',
          'address': '0x6b495143665763101d13f9ec71635543748795dc'
        },
        'indexedTags': {
          'class': 'IndexedTags',
          'address': '0x3f4908343830f1cf6c07fc399ee0a4ae132ac5df'
        }
      }
    };
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = environments[env];
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'AkashaProfile': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'getCollector',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'fullName',
                'type': 'string'
              }
            ],
            'name': 'setFullName',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'newAddr',
                'type': 'address'
              }
            ],
            'name': 'setEthAddress',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'chunks',
                'type': 'bytes32[2]'
              }
            ],
            'name': 'setHash',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'removeProfile',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getIpfs',
            'outputs': [
              {
                'name': 'chunk1',
                'type': 'bytes32'
              },
              {
                'name': 'chunk2',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'owner',
                'type': 'address'
              },
              {
                'name': 'registrar',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [],
            'name': 'UpdateInfo',
            'type': 'event'
          }
        ],
        'bytecode': '60606040526040516040806106f5833981016040528080519060200190919080519060200190919050505b81600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080905080505b505061068a8061006b6000396000f360606040523615610074576000357c01000000000000000000000000000000000000000000000000000000009004806350228201146100815780635f4f35d5146100ba5780639b0da5d514610110578063a568544614610128578063eab6af7814610165578063f8dd5af51461017457610074565b61007f5b610002565b565b005b61008e60048050506101a6565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61010e6004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610257565b005b6101266004808035906020019091905050610393565b005b61016360048080604001906002806020026040519081016040528092919082600260200280828437820191505050505090909190505061041e565b005b6101726004805050610517565b005b6101816004805050610649565b6040518083600019168152602001826000191681526020019250505060405180910390f35b6000600073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561022a57600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610254565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610254565b90565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102b357610002565b8060026000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061030257805160ff1916838001178555610333565b82800160010185558215610333579182015b82811115610332578251826000505591602001919060010190610314565b5b50905061035e9190610340565b8082111561035a5760008181506000905550600101610340565b5090565b50507f0427fd93f6c08e97e259405a615c46287516c798e04e361edde42cbb14ccd2a260405180905060405180910390a15b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103ef57610002565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561047a57610002565b806003600050906002826002909081019282156104b7579160200282015b828111156104b6578251826000505591602001919060010190610498565b5b5090506104e291906104c4565b808211156104de57600081815060009055506001016104c4565b5090565b50507f0427fd93f6c08e97e259405a615c46287516c798e04e361edde42cbb14ccd2a260405180905060405180910390a15b50565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561057557610002565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e79a198f604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f11561000257505050604051805190602001509050801561064557600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b50565b600060006003600050600060028110156100025790900160005b50546003600050600160028110156100025790900160005b505491509150610686565b909156'
      },
      'AkashaRegistry': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'getMyProfile',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'getByAddr',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              }
            ],
            'name': 'getById',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'destroy',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              }
            ],
            'name': 'hasProfile',
            'outputs': [
              {
                'name': 'exists',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': '_creator',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              }
            ],
            'name': 'register',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'unregister',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'contr',
                'type': 'address'
              }
            ],
            'name': 'Register',
            'type': 'event'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b610dd48061003f6000396000f36060604052361561008a576000357c01000000000000000000000000000000000000000000000000000000009004806321527e5014610097578063259a1a34146100d05780632dff0d0d1461011257806383197ef014610154578063ad4b7cb114610163578063bc8bde6414610191578063e1fa8e84146101ca578063e79a198f146101e25761008a565b6100955b610002565b565b005b6100a46004805050610207565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100e6600480803590602001909190505061021c565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61012860048080359060200190919050506102bc565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101616004805050610305565b005b610179600480803590602001909190505061039e565b60405180821515815260200191505060405180910390f35b61019e6004805050610425565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101e0600480803590602001909190505061044b565b005b6101ef60048050506105e2565b60405180821515815260200191505060405180910390f35b60006102123361021c565b9050610219565b90565b6000600160005060006002600050600085604051808273ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140191505060405180910390206000191681526020019081526020016000206000505460001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506102b7565b919050565b6000600160005060008360001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610300565b919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561036157610002565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b6000600073ffffffffffffffffffffffffffffffffffffffff166103c1836102bc565b73ffffffffffffffffffffffffffffffffffffffff161415806104195750600073ffffffffffffffffffffffffffffffffffffffff166104003361021c565b73ffffffffffffffffffffffffffffffffffffffff1614155b9050610420565b919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6104548161039e565b1561045e57610002565b33306040516106f5806106df833901808373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff16815260200192505050604051809103906000f0600160005060008360001916815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550806002600050600033604051808273ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140191505060405180910390206000191681526020019081526020016000206000508190555080600019167f1082cda15f9606da555bb7e9bf4eeee2f8e34abe85d3924bf9bacb716f8feca6600160005060008460001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a25b50565b6000600033604051808273ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014019150506040518091039020905061064960026000506000836000191681526020019081526020016000206000505461039e565b156106d2576001600050600060026000506000846000191681526020019081526020016000206000505460001916815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600260005060008260001916815260200190815260200160002060005060009055600191506106db565b600091506106db565b50905660606040526040516040806106f5833981016040528080519060200190919080519060200190919050505b81600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080905080505b505061068a8061006b6000396000f360606040523615610074576000357c01000000000000000000000000000000000000000000000000000000009004806350228201146100815780635f4f35d5146100ba5780639b0da5d514610110578063a568544614610128578063eab6af7814610165578063f8dd5af51461017457610074565b61007f5b610002565b565b005b61008e60048050506101a6565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61010e6004808035906020019082018035906020019191908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050909091905050610257565b005b6101266004808035906020019091905050610393565b005b61016360048080604001906002806020026040519081016040528092919082600260200280828437820191505050505090909190505061041e565b005b6101726004805050610517565b005b6101816004805050610649565b6040518083600019168152602001826000191681526020019250505060405180910390f35b6000600073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561022a57600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610254565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610254565b90565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102b357610002565b8060026000509080519060200190828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061030257805160ff1916838001178555610333565b82800160010185558215610333579182015b82811115610332578251826000505591602001919060010190610314565b5b50905061035e9190610340565b8082111561035a5760008181506000905550600101610340565b5090565b50507f0427fd93f6c08e97e259405a615c46287516c798e04e361edde42cbb14ccd2a260405180905060405180910390a15b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103ef57610002565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561047a57610002565b806003600050906002826002909081019282156104b7579160200282015b828111156104b6578251826000505591602001919060010190610498565b5b5090506104e291906104c4565b808211156104de57600081815060009055506001016104c4565b5090565b50507f0427fd93f6c08e97e259405a615c46287516c798e04e361edde42cbb14ccd2a260405180905060405180910390a15b50565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561057557610002565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e79a198f604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f11561000257505050604051805190602001509050801561064557600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b50565b600060006003600050600060028110156100025790900160005b50546003600050600160028110156100025790900160005b505491509150610686565b909156'
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      this.objects[i] = this.classes[obj['class']].at(obj.address);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dapple['contracts'];
}
