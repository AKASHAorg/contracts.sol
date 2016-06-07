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
            'address': '0x6c78449dc12611252a8a44419754fff1a56a36e7'
          },
          'helper': {
            'class': 'AkashaLib',
            'address': '0xdf7708f8dfd4c26da423649ce50e621ca15f668f'
          },
          'tags': {
            'class': 'AkashaTags',
            'address': '0xccab5372ed2597e175041a63811aaaf7621ae865'
          },
          'indexedTags': {
            'class': 'IndexedTags',
            'address': '0x3d1358cf4d024120ae19002822228344c61e394f'
          },
          'badges': {
            'class': 'AkashaBadges',
            'address': '0x086becd9ee4610f610276cb1a9c0e5cddc27f038'
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
          'address': '0x6c78449dc12611252a8a44419754fff1a56a36e7'
        },
        'helper': {
          'class': 'AkashaLib',
          'address': '0xdf7708f8dfd4c26da423649ce50e621ca15f668f'
        },
        'tags': {
          'class': 'AkashaTags',
          'address': '0xccab5372ed2597e175041a63811aaaf7621ae865'
        },
        'indexedTags': {
          'class': 'IndexedTags',
          'address': '0x3d1358cf4d024120ae19002822228344c61e394f'
        },
        'badges': {
          'class': 'AkashaBadges',
          'address': '0x086becd9ee4610f610276cb1a9c0e5cddc27f038'
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
      'AkashaBadges': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'name': '_knownBadges',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes32'
              }
            ],
            'name': 'getBadge',
            'outputs': [
              {
                'name': 'first',
                'type': 'bytes32'
              },
              {
                'name': 'second',
                'type': 'bytes32'
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
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes32'
              },
              {
                'name': 'hash',
                'type': 'bytes32[2]'
              }
            ],
            'name': 'createBadge',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes32'
              }
            ],
            'name': 'badgeExists',
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
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b61046a8061003f6000396000f360606040523615610069576000357c010000000000000000000000000000000000000000000000000000000090048063676c20481461007657806377002fcf146100a657806383197ef0146100e1578063ae94ebd1146100f0578063af4bd7431461014c57610069565b6100745b610002565b565b005b61008c600480803590602001909190505061017a565b604051808260001916815260200191505060405180910390f35b6100bc600480803590602001909190505061019f565b6040518083600019168152602001826000191681526020019250505060405180910390f35b6100ee6004805050610211565b005b6101346004808035906020019091908060400190600280602002604051908101604052809291908260026020028082843782019150505050509090919050506102aa565b60405180821515815260200191505060405180910390f35b610162600480803590602001909190505061041d565b60405180821515815260200191505060405180910390f35b600260005081815481101561000257906000526020600020900160005b915090505481565b600060006001600050600084600019168152602001908152602001600020600050600060028110156100025790900160005b50546001600050600085600019168152602001908152602001600020600050600160028110156100025790900160005b50549150915061020c565b915091565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561026d57610002565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561030857610002565b6103118361041d565b1561031f5760009050610417565b81600160005060008560001916815260200190815260200160002060005090600282600290908101928215610374579160200282015b82811115610373578251826000505591602001919060010190610355565b5b50905061039f9190610381565b8082111561039b5760008181506000905550600101610381565b5090565b5050600260005080548060010182818154818355818115116103f3578183600052602060002091820191016103f291906103d4565b808211156103ee57600081815060009055506001016103d4565b5090565b5b5050509190906000526020600020900160005b859091909150555060019050610417565b92915050565b60006000600102600019166001600050600084600019168152602001908152602001600020600050600060028110156100025790900160005b50546000191614159050610465565b91905056'
      },
      'AkashaLib': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'first',
                'type': 'bytes32'
              },
              {
                'name': 'second',
                'type': 'bytes32'
              }
            ],
            'name': 'getIpfs',
            'outputs': [
              {
                'name': '',
                'type': 'string'
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
                'name': 'chunk',
                'type': 'bytes32'
              }
            ],
            'name': 'bytes32ToString',
            'outputs': [
              {
                'name': '',
                'type': 'string'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6105868061003f6000396000f360606040523615610053576000357c01000000000000000000000000000000000000000000000000000000009004806353ef4a531461006057806383197ef0146100ed5780639201de55146100fc57610053565b61005e5b610002565b565b005b61007f6004808035906020019091908035906020019091905050610180565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156100df5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6100fa60048050506101ca565b005b6101126004808035906020019091905050610263565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101725780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60206040519081016040528060008152602001506101bd6101a6836000191661029c9090565b6101b5856000191661029c9090565b6102e8909190565b90506101c4565b92915050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561022657610002565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b565b6020604051908101604052806000815260200150610290610289836000191661029c9090565b61037f9090565b9050610297565b919050565b60406040519081016040528060008152602001600081526020015060405160208101604052828152806020830152506102d4826103f6565b81600001909081815260200150505b919050565b602060405190810160405280600081526020015060206040519081016040528060008152602001506000836000015185600001510160405180591061032a5750595b908082528060200260200182016040525091506020820190506103568186602001518760000151610533565b61036f8560000151820185602001518660000151610533565b819250610377565b505092915050565b60206040519081016040528060008152602001506020604051908101604052806000815260200150600083600001516040518059106103bb5750595b908082528060200260200182016040525091506020820190506103e78185602001518660000151610533565b8192506103ef565b5050919050565b60006000600060010283600019161415610413576000915061052d565b60006001026fffffffffffffffffffffffffffffffff6001028416600019161415610460576010810190508050700100000000000000000000000000000000836001900404600102925082505b600060010267ffffffffffffffff600102841660001916141561049d57600881019050805068010000000000000000836001900404600102925082505b600060010263ffffffff60010284166000191614156104d2576004810190508050640100000000836001900404600102925082505b600060010261ffff600102841660001916141561050357600281019050805062010000836001900404600102925082505b600060010260ff60010284166000191614156105225760018101905080505b80602003915061052d565b50919050565b60005b6020821015156105625782518452602084019350835060208301925082505b6020820391508150610536565b6001826020036101000a039050801983511681855116818117865250505b5050505056'
      },
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
      },
      'AkashaTags': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32'
              }
            ],
            'name': 'exists',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32'
              }
            ],
            'name': 'add',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32'
              }
            ],
            'name': 'getTagId',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
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
                'name': 'position',
                'type': 'uint256'
              }
            ],
            'name': 'getTagAt',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': '_length',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'libAddress',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'tag',
                'type': 'bytes32'
              }
            ],
            'name': 'TagCreated',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052600160036000505560405160208061040e833981016040528080519060200190919050505b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b506103aa806100646000396000f360606040523615610074576000357c01000000000000000000000000000000000000000000000000000000009004806338a699a414610081578063446bffba146100af5780636d74e7ab146100db57806383197ef014610107578063d857eba614610116578063fa2b42811461014657610074565b61007f5b610002565b565b005b6100976004808035906020019091905050610169565b60405180821515815260200191505060405180910390f35b6100c56004808035906020019091905050610199565b6040518082815260200191505060405180910390f35b6100f160048080359060200190919050506102b4565b6040518082815260200191505060405180910390f35b61011460048050506102e0565b005b61012c6004808035906020019091905050610374565b604051808260001916815260200191505060405180910390f35b61015360048050506103a1565b6040518082815260200191505060405180910390f35b6000600060016000506000846000191681526020019081526020016000206000505414159050610194565b919050565b60006101a482610169565b156101ae57610002565b60026000508054806001018281815481835581811511610200578183600052602060002091820191016101ff91906101e1565b808211156101fb57600081815060009055506001016101e1565b5090565b5b5050509190906000526020600020900160005b8490919091505550600360005054600160005060008460001916815260200190815260200160002060005081905550600360008181505480929190600101919050555081600019167f2cbbbefb5b1acf02521fecc3ca9bbb887bdd88549017993f7fffa8e5bc27cc6860405180905060405180910390a260016000506000836000191681526020019081526020016000206000505490506102af565b919050565b600060016000506000836000191681526020019081526020016000206000505490506102db565b919050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561037157600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b6000600260005082815481101561000257906000526020600020900160005b5054905061039c565b919050565b6003600050548156'
      },
      'IndexedTags': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32'
              }
            ],
            'name': 'subscribe',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'subscriber',
                'type': 'address'
              },
              {
                'name': 'tagId',
                'type': 'uint256'
              }
            ],
            'name': 'isSubscribed',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
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
                'name': '',
                'type': 'uint256'
              }
            ],
            'name': 'cursor',
            'outputs': [
              {
                'name': 'totalSubs',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32[]'
              }
            ],
            'name': 'indexEntry',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'tag',
                'type': 'bytes32'
              }
            ],
            'name': 'unsubscribe',
            'outputs': [],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'tags',
                'type': 'address'
              },
              {
                'name': 'registry',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'tag',
                'type': 'uint256'
              },
              {
                'indexed': false,
                'name': 'entry',
                'type': 'address'
              }
            ],
            'name': 'IndexedTag',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052604051604080610d17833981016040528080519060200190919080519060200190919050505b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555081600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5050610c5b806100bc6000396000f360606040523615610074576000357c0100000000000000000000000000000000000000000000000000000000900480632faf44f61461008157806336867ae61461009957806383197ef0146100d057806392cd9479146100df578063d88802fe1461010b578063f8c601461461015e57610074565b61007f5b610002565b565b005b6100976004808035906020019091905050610176565b005b6100b86004808035906020019091908035906020019091905050610479565b60405180821515815260200191505060405180910390f35b6100dd6004805050610533565b005b6100f560048080359060200190919050506105c7565b6040518082815260200191505060405180910390f35b61015c600480803590602001908201803590602001919190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509090919050506105eb565b005b610174600480803590602001909190505061091e565b005b60006000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636d74e7ab84604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001509150600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663259a1a3433604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001509050600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614806103935750600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338a699a484604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150155b806103a457506103a38183610479565b5b156103ae57610002565b600460005060008273ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805480600101828181548183558181151161042a57818360005260206000209182019101610429919061040b565b80821115610425576000818150600090555060010161040b565b5090565b5b5050509190906000526020600020900160005b8490919091505550600360005060008381526020019081526020016000206000506001016000818150548092919060010191905055505b505050565b60006000600090505b600460005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050805490508110156105235782600460005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b50541415610515576001915061052c565b5b8080600101915050610482565b6000915061052c565b5092915050565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156105c457600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b60036000506020528060005260406000206000915090508060010160005054905081565b6000600090505b815181101561091957600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338a699a4838381518110156100025790602001906020020151604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f115610002575050506040518051906020015015156106b357610002565b60036000506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636d74e7ab858581518110156100025790602001906020020151604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150815260200190815260200160002060005060000160005080548060010182818154818355818115116107cb578183600052602060002091820191016107ca91906107ac565b808211156107c657600081815060009055506001016107ac565b5090565b5b5050509190906000526020600020900160005b33909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550507f65e16ab7c9339d87377d6ad2c9233e53671562d663c9f30ee6a8dd861b8a1580600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636d74e7ab848481518110156100025790602001906020020151604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f115610002575050506040518051906020015033604051808381526020018273ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b80806001019150506105f2565b5b5050565b60006000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636d74e7ab84604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001509150600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663259a1a3433604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001509050600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166338a699a484604051827c010000000000000000000000000000000000000000000000000000000002815260040180826000191681526020019150506020604051808303816000876161da5a03f11561000257505050604051805190602001501580610b165750610b148183610479565b155b15610b2057610002565b600460005060008273ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050610b598284610baa565b815481101561000257906000526020600020900160005b506000905560036000506000838152602001908152602001600020600050600101600081815054809291906001900391905055505b505050565b60006000600090505b600460005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005080549050811015610c535782600460005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005082815481101561000257906000526020600020900160005b50541415610c4557809150610c54565b5b8080600101915050610bb3565b5b509291505056'
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
