'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['contracts'] = (function builder () {
  var environments = {};

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
      env = {};
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
            'name': '_owner',
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
                'name': '_plm',
                'type': 'bytes23[2]'
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
            'inputs': [
              {
                'name': 'owner',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          }
        ],
        'bytecode': '60606040526040516020806103a6833981016040528080519060200190919050505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5061034a8061005c6000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063b2bdfa7b14610044578063fc7e5d731461007d57610042565b005b6100516004805050610126565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100b860048080604001906002806020026040519081016040528092919082600260200280828437820191505050505090909190505061014c565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101185780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6020604051908101604052806000815260200150602060405190810160405280600081526020015060006000600060006020604051908101604052806000815260200150602e60405180591061019f5750595b90808252806020026020018201604052509550600093505b600284101561028a57600092505b601783101561027c578260080260020a88856002811015610002579090602002015169010000000000000000009004026001027f010000000000000000000000000000000000000000000000000000000000000080910402915060007f0100000000000000000000000000000000000000000000000000000000000000028214151561026e57818686815181101561000257906020010190908160001a90535060018501945084505b5b82806001019350506101c5565b5b83806001019450506101b7565b846040518059106102985750595b908082528060200260200182016040525090506000935083505b848410156103375785848151811015610002579060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000028185815181101561000257906020010190908160001a9053505b83806001019450506102b2565b80965061033f565b50505050505091905056'
      },
      'AkashaRegistry': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              }
            ],
            'name': 'unregister',
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
            'name': 'exists',
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
            'inputs': [
              {
                'name': 'key',
                'type': 'bytes32'
              }
            ],
            'name': 'get',
            'outputs': [
              {
                'name': 'value',
                'type': 'address'
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
                'name': 'key',
                'type': 'bytes32'
              }
            ],
            'name': 'register',
            'outputs': [],
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
                'name': 'key',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'address'
              }
            ],
            'name': 'Register',
            'type': 'event'
          }
        ],
        'bytecode': '60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b61091e8061003f6000396000f360606040523615610069576000357c0100000000000000000000000000000000000000000000000000000000900480631a0919dc1461007657806338a699a41461008e5780638eaa6ac0146100ba578063bc8bde64146100fc578063e1fa8e841461013557610069565b6100745b610002565b565b005b61008c6004808035906020019091905050610325565b005b6100a46004808035906020019091905050610468565b6040518082815260200191505060405180910390f35b6100d06004808035906020019091905050610533565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610109600480505061014d565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61014b6004808035906020019091905050610173565b005b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b61017c81610468565b1561018657610002565b336040516103a680610578833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f06001600050600083815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506001600050600082815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550807f1082cda15f9606da555bb7e9bf4eeee2f8e34abe85d3924bf9bacb716f8feca6600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a25b50565b6001600050600082815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610464576001600050600082815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690555b5b50565b6000600073ffffffffffffffffffffffffffffffffffffffff1661048b83610533565b73ffffffffffffffffffffffffffffffffffffffff161415806105275750600073ffffffffffffffffffffffffffffffffffffffff16600260005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614155b905061052e565b919050565b60006001600050600083815260200190815260200160002060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610573565b9190505660606040526040516020806103a6833981016040528080519060200190919050505b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5061034a8061005c6000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063b2bdfa7b14610044578063fc7e5d731461007d57610042565b005b6100516004805050610126565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100b860048080604001906002806020026040519081016040528092919082600260200280828437820191505050505090909190505061014c565b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101185780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6020604051908101604052806000815260200150602060405190810160405280600081526020015060006000600060006020604051908101604052806000815260200150602e60405180591061019f5750595b90808252806020026020018201604052509550600093505b600284101561028a57600092505b601783101561027c578260080260020a88856002811015610002579090602002015169010000000000000000009004026001027f010000000000000000000000000000000000000000000000000000000000000080910402915060007f0100000000000000000000000000000000000000000000000000000000000000028214151561026e57818686815181101561000257906020010190908160001a90535060018501945084505b5b82806001019350506101c5565b5b83806001019450506101b7565b846040518059106102985750595b908082528060200260200182016040525090506000935083505b848410156103375785848151811015610002579060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000028185815181101561000257906020010190908160001a9053505b83806001019450506102b2565b80965061033f565b50505050505091905056'
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
