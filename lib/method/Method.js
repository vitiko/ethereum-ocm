'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MethodCall = require('./MethodCall');

var _MethodCall2 = _interopRequireDefault(_MethodCall);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Method = function () {
  function Method(_ref) {
    var structure = _ref.structure,
        abi = _ref.abi;

    _classCallCheck(this, Method);

    this.structure = structure;
    this.abi = abi;

    this._inputNames = undefined;
    this._inputs = undefined;

    if (!abi && new.target === Method) throw new Error('ABI for method ' + structure.name + ' not defined');

    this._prepareInputs();
  }

  _createClass(Method, [{
    key: 'createCall',
    value: function createCall(args) {
      return new _MethodCall2.default(this, args);
    }
  }, {
    key: '_prepareInputs',
    value: function _prepareInputs() {
      var _this = this;

      if (this._inputs != undefined) return;

      this._inputs = this.abi.inputs.map(function (input, pos) {
        var param = _this.structure.params[_this.structure.paramsSeq[pos]];
        //console.log('-->', returns);
        input.typeHint = param.typeHint;
        input.pos = pos;

        return input;
      });

      this._inputNames = this.abi.inputs.map(function (input) {
        return input.name;
      });
    }
  }, {
    key: 'hasInput',
    value: function hasInput(inputName) {
      return this._inputNames.indexOf(inputName) != -1;
    }
  }, {
    key: 'hasInputLike',
    value: function hasInputLike(inputName) {
      return this.getInputByNameLike(inputName) ? true : false;
    }
  }, {
    key: 'getInputByNameLike',
    value: function getInputByNameLike(inputName) {

      if (this.hasInput(inputName)) return this.getInputByName(inputName);
      if (this.hasInput('_' + inputName)) return this.getInputByName('_' + inputName);

      return null;
    }
  }, {
    key: 'getInputByName',
    value: function getInputByName(inputName) {
      return this.hasInput(inputName) ? this._inputs[this._inputNames.indexOf(inputName)] : null;
    }
  }, {
    key: 'name',
    get: function get() {
      return this.abi.name;
    }
  }, {
    key: 'constant',
    get: function get() {
      return this.abi.constant;
    }
  }, {
    key: 'inputs',
    get: function get() {
      return this._inputs;
    }
  }, {
    key: 'inputNames',
    get: function get() {
      return this._inputNames;
    }
  }, {
    key: 'outputs',
    get: function get() {
      var _this2 = this;

      return this.abi.outputs.map(function (output, pos) {

        //console.log ('RETURNS', this.structure );

        var returns = _this2.structure.returns[_this2.structure.returnsSeq[pos]];
        //console.log('-->', returns);
        output.typeHint = returns.typeHint;
        return output;
      });
    }
  }, {
    key: 'isArrayAccess',
    get: function get() {
      return this.abi.inputs.length == 1 && this.abi.inputs[0].type.substr(0, 4) == 'uint' && this.abi.inputs[0].name == '';
    }
  }]);

  return Method;
}();

exports.default = Method;