'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Method2 = require('./Method');

var _Method3 = _interopRequireDefault(_Method2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//Constructor structure now rely only on information from solidity-structure
var ConstructorMethod = function (_Method) {
  _inherits(ConstructorMethod, _Method);

  function ConstructorMethod() {
    _classCallCheck(this, ConstructorMethod);

    return _possibleConstructorReturn(this, (ConstructorMethod.__proto__ || Object.getPrototypeOf(ConstructorMethod)).apply(this, arguments));
  }

  _createClass(ConstructorMethod, [{
    key: '_prepareInputs',
    value: function _prepareInputs() {
      var _this2 = this;

      if (this._inputs != undefined) return;

      this._inputs = this.structure.paramsSeq.map(function (paramName) {
        return _this2.structure.params[paramName];
      }).map(function (input, pos) {
        input.pos = pos;
        return input;
      });

      this._inputNames = this.structure.paramsSeq;
    }
  }, {
    key: 'name',
    get: function get() {
      return 'constructor';
    }
  }]);

  return ConstructorMethod;
}(_Method3.default);

exports.default = ConstructorMethod;