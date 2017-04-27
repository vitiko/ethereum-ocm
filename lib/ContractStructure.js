'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _solidityStructure = require('solidity-structure');

var _solidityStructure2 = _interopRequireDefault(_solidityStructure);

var _Method = require('./method/Method');

var _Method2 = _interopRequireDefault(_Method);

var _ConstructorMethod = require('./method/ConstructorMethod');

var _ConstructorMethod2 = _interopRequireDefault(_ConstructorMethod);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ContractStructure = function () {
  function ContractStructure(_ref) {
    var truffleContract = _ref.truffleContract,
        sourceStructure = _ref.sourceStructure,
        data = _ref.data,
        sourcePath = _ref.sourcePath,
        abi = _ref.abi,
        abiHints = _ref.abiHints;

    _classCallCheck(this, ContractStructure);

    if (truffleContract) this._abi = truffleContract.abi;else this._abi = abi;

    this._abiHints = abiHints;

    if (sourceStructure) this._sourceStructure = sourceStructure;else if (data && data.sourceStructure) this._sourceStructure = data.sourceStructure;else if (sourcePath) this._sourceStructure = _solidityStructure2.default.parseFile(sourcePath).toJSON();

    //another way - get structure from abi and abiHints if available
    //... later


    else throw new Error('Data not contain structure of solidity contract, therefore sourceStructure or sourcePath must provided to constructor');

    this._methods = {};
  }

  _createClass(ContractStructure, [{
    key: 'export',
    value: function _export() {

      return this._sourceStructure;
    }

    //constructor params not exist in ABI

  }, {
    key: 'getConstructor',
    value: function getConstructor() {
      if (!this._sourceStructure.contract.constructor) return undefined;

      if (!this._methods['__constructor']) this._methods['__constructor'] = new _ConstructorMethod2.default({
        structure: this._sourceStructure.contract.constructor
      });

      return this._methods['__constructor'];
    }
  }, {
    key: 'hasMethod',
    value: function hasMethod(methodName) {
      return this._sourceStructure.functions[methodName] != undefined || this._sourceStructure.constantFunctions[methodName] != undefined;
    }
  }, {
    key: 'getConstantMethods',
    value: function getConstantMethods() {
      var _this = this;

      return this._abi.filter(function (methodAbi) {
        return methodAbi.constant;
      }).map(function (methodAbi) {
        return _this.getMethod(methodAbi.name);
      });
    }
  }, {
    key: 'getMethod',
    value: function getMethod(methodName) {
      if (!this.hasMethod(methodName)) return undefined;

      if (!this._methods[methodName]) this._methods[methodName] = new _Method2.default({
        structure: this._sourceStructure.functions[methodName] || this._sourceStructure.constantFunctions[methodName],
        abi: this._abi.find(function (methodAbi) {
          return methodAbi.name == methodName;
        })
      });

      return this._methods[methodName];
    }
  }]);

  return ContractStructure;
}();

exports.default = ContractStructure;