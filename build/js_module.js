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
          'registry': {
            'class': 'AkashaRegistry',
            'address': '0x746c7649d41f604ebfbedd32e20ce01c0d2d5eae'
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
        'registry': {
          'class': 'AkashaRegistry',
          'address': '0x746c7649d41f604ebfbedd32e20ce01c0d2d5eae'
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
              },
              {
                'name': 'chunks',
                'type': 'bytes32[2]'
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
        'bytecode': '60606040526040516080806105c18339810160405280805190602001909190805190602001909190908160400150505b82600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550806003600050906002826002909081019282156094579160200282015b8281111560935782518260005055916020019190600101906077565b5b50905060bb9190609f565b8082111560b75760008181506000905550600101609f565b5090565b505081915081505b5050506104ed806100d46000396000f360606040523615610069576000357c01000000000000000000000000000000000000000000000000000000009004806350228201146100765780639b0da5d5146100af578063a5685446146100c7578063eab6af7814610104578063f8dd5af51461011357610069565b6100745b610002565b565b005b6100836004805050610145565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100c560048080359060200190919050506101f6565b005b610102600480806040019060028060200260405190810160405280929190826002602002808284378201915050505050909091905050610281565b005b610111600480505061037a565b005b61012060048050506104ac565b6040518083600019168152602001826000191681526020019250505060405180910390f35b6000600073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156101c957600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506101f3565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506101f3565b90565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561025257610002565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102dd57610002565b8060036000509060028260029090810192821561031a579160200282015b828111156103195782518260005055916020019190600101906102fb565b5b5090506103459190610327565b808211156103415760008181506000905550600101610327565b5090565b50507f0427fd93f6c08e97e259405a615c46287516c798e04e361edde42cbb14ccd2a260405180905060405180910390a15b50565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103d857610002565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e79a198f604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f1156100025750505060405180519060200150905080156104a857600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b50565b600060006003600050600060028110156100025790900160005b50546003600050600160028110156100025790900160005b5054915091506104e9565b909156'
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
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'name': 'ipfsChunks',
                'type': 'bytes32[2]'
              }
            ],
            'name': 'register',
            'outputs': [],
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
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b610cf28061003f6000396000f36060604052361561008a576000357c01000000000000000000000000000000000000000000000000000000009004806321527e5014610097578063259a1a34146100d05780632dff0d0d1461011257806330d000121461015457806383197ef01461019a578063ad4b7cb1146101a9578063bc8bde64146101d7578063e79a198f146102105761008a565b6100955b610002565b565b005b6100a46004805050610235565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100e6600480803590602001909190505061024a565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61012860048080359060200190919050506102ea565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610198600480803590602001909190806040019060028060200260405190810160405280929190826002602002808284378201915050505050909091905050610333565b005b6101a760048050506104ee565b005b6101bf6004808035906020019091905050610587565b60405180821515815260200191505060405180910390f35b6101e4600480505061060e565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61021d6004805050610634565b60405180821515815260200191505060405180910390f35b60006102403361024a565b9050610247565b90565b6000600160005060006002600050600085604051808273ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140191505060405180910390206000191681526020019081526020016000206000505460001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506102e5565b919050565b6000600160005060008360001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905061032e565b919050565b61033c82610587565b1561034657610002565b3330826040516105c180610731833901808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001826002602002808383829060006004602084601f0104600f02600301f1509050019350505050604051809103906000f0600160005060008460001916815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550816002600050600033604051808273ffffffffffffffffffffffffffffffffffffffff166c0100000000000000000000000002815260140191505060405180910390206000191681526020019081526020016000206000508190555081600019167f1082cda15f9606da555bb7e9bf4eeee2f8e34abe85d3924bf9bacb716f8feca6600160005060008560001916815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a25b5050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561054a57610002565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b6000600073ffffffffffffffffffffffffffffffffffffffff166105aa836102ea565b73ffffffffffffffffffffffffffffffffffffffff161415806106025750600073ffffffffffffffffffffffffffffffffffffffff166105e93361024a565b73ffffffffffffffffffffffffffffffffffffffff1614155b9050610609565b919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600033604051808273ffffffffffffffffffffffffffffffffffffffff166c010000000000000000000000000281526014019150506040518091039020905061069b600260005060008360001916815260200190815260200160002060005054610587565b15610724576001600050600060026000506000846000191681526020019081526020016000206000505460001916815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556002600050600082600019168152602001908152602001600020600050600090556001915061072d565b6000915061072d565b50905660606040526040516080806105c18339810160405280805190602001909190805190602001909190908160400150505b82600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550806003600050906002826002909081019282156094579160200282015b8281111560935782518260005055916020019190600101906077565b5b50905060bb9190609f565b8082111560b75760008181506000905550600101609f565b5090565b505081915081505b5050506104ed806100d46000396000f360606040523615610069576000357c01000000000000000000000000000000000000000000000000000000009004806350228201146100765780639b0da5d5146100af578063a5685446146100c7578063eab6af7814610104578063f8dd5af51461011357610069565b6100745b610002565b565b005b6100836004805050610145565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100c560048080359060200190919050506101f6565b005b610102600480806040019060028060200260405190810160405280929190826002602002808284378201915050505050909091905050610281565b005b610111600480505061037a565b005b61012060048050506104ac565b6040518083600019168152602001826000191681526020019250505060405180910390f35b6000600073ffffffffffffffffffffffffffffffffffffffff16600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156101c957600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506101f3565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506101f3565b90565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561025257610002565b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b50565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102dd57610002565b8060036000509060028260029090810192821561031a579160200282015b828111156103195782518260005055916020019190600101906102fb565b5b5090506103459190610327565b808211156103415760008181506000905550600101610327565b5090565b50507f0427fd93f6c08e97e259405a615c46287516c798e04e361edde42cbb14ccd2a260405180905060405180910390a15b50565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103d857610002565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e79a198f604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f1156100025750505060405180519060200150905080156104a857600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b50565b600060006003600050600060028110156100025790900160005b50546003600050600160028110156100025790900160005b5054915091506104e9565b909156'
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
