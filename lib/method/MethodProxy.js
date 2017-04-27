'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MethodCall = require('./MethodCall');

var _MethodCall2 = _interopRequireDefault(_MethodCall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MethodProxy = function () {
  function MethodProxy(truffleContract, structure) {
    _classCallCheck(this, MethodProxy);

    this._truffleContract = truffleContract;
    this._structure = structure;
  }

  /**
   * Execute method of truffle contract
   * @param methodName
   * @param args
   * @returns {Promise}
   */


  _createClass(MethodProxy, [{
    key: 'execute',
    value: function execute(methodName, args) {
      //console.log ('method proxy', methodName, args);
      return this.executeMethodCall(this.createMethodCall(methodName, args));
    }
  }, {
    key: 'executeMethodCall',
    value: function executeMethodCall(methodCall) {
      return methodCall.execute(this._truffleContract);
    }
  }, {
    key: 'createMethodCall',
    value: function createMethodCall(methodName, args) {
      if (!this._structure.hasMethod(methodName)) throw new Error('Method "' + methodName + '" is not defined in contract ' + this._truffleContract.contract_name);

      return new _MethodCall2.default(this._structure.getMethod(methodName), args);
    }
  }]);

  return MethodProxy;
}();

exports.default = MethodProxy;