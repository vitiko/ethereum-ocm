'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _Contract = require('./Contract');

var _Contract2 = _interopRequireDefault(_Contract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContractManager = function () {
  function ContractManager(_ref) {
    var paths = _ref.paths,
        rpc = _ref.rpc;

    _classCallCheck(this, ContractManager);

    this.paths = paths;
    this.rpc = rpc;
  }

  _createClass(ContractManager, [{
    key: 'contractExists',
    value: function contractExists(contractName) {
      return _fs2.default.existsSync(this.getSourcePath(this.normalizeName(contractName)));
    }

    //Contract name can be contract object ?

  }, {
    key: 'contract',
    value: function contract(contractName) {
      contractName = this.normalizeName(contractName);
      var sourcePath = this.getSourcePath(contractName);

      if (!this.contractExists(contractName)) throw new Error('Contract source not found:  ' + sourcePath);

      var dataPath = this.getDataPath(contractName);
      if (!_fs2.default.existsSync(dataPath)) throw new Error('Contract artifact not found:  ' + dataPath);

      // console.log('Create contract', contractName, sourcePath, dataPath);

      return new _Contract2.default({ sourcePath: sourcePath, dataPath: dataPath, provider: this.createWeb3Provider() });
    }
  }, {
    key: 'createWeb3Provider',
    value: function createWeb3Provider() {
      if (!this.provider) this.provider = new _web2.default.providers.HttpProvider('http://' + this.rpc.host + ':' + this.rpc.port);
      return this.provider;
    }
  }, {
    key: 'normalizeName',
    value: function normalizeName(contractName) {
      if (!contractName.endsWith('.sol')) contractName += '.sol';
      return contractName;
    }
  }, {
    key: 'getSourcePath',
    value: function getSourcePath(contractName) {
      return this.paths.contract.source + '/' + contractName;
    }
  }, {
    key: 'getDataPath',
    value: function getDataPath(contractName) {
      return this.paths.contract.build + '/' + _path2.default.basename(contractName).slice(0, -4) + '.json';
    }
  }, {
    key: 'at',
    value: function at(address) {

      var web3 = new _web2.default(this.createWeb3Provider());

      var contractCode = web3.eth.getCode(address);

      var creationTx = web3.eth.getTransaction('0x3180001a7756e6a1d303e0c54b465eece6706121e5ceb9669dd21fac97772aaa');

      console.log(creationTx);

      var local = void 0;

      // console.log (this.paths.contract.build);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _fs2.default.readdirSync(this.paths.contract.build)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var dataFile = _step.value;


          var data = require(this.paths.contract.build + '/' + dataFile);

          //console.log  (data.contract_name, data.unlinked_binary);

          if (data.unlinked_binary == contractCode) console.log(data.contract_name);

          if (data.contract_name == 'IPObjectPhonogram') {

            local = data;

            // console.log (data.unlinked_binary.length.subst)
            //, ' -- ', data.unlinked_binary
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      console.log('\n\nContract deployed code length ', contractCode.length);
      console.log('\n\nTx:' + creationTx.input.length);
      console.log('\n\nLocal:' + local.contract_name + ' length ', local.unlinked_binary.length);

      console.log(creationTx.input.substr(0, local.unlinked_binary.length) == local.unlinked_binary);
      //, ' -- ', contractCode

    }
  }]);

  return ContractManager;
}();

module.exports = ContractManager;