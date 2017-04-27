'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RawType2 = require('./RawType');

var _RawType3 = _interopRequireDefault(_RawType2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddressType = function (_RawType) {
  _inherits(AddressType, _RawType);

  function AddressType() {
    _classCallCheck(this, AddressType);

    return _possibleConstructorReturn(this, (AddressType.__proto__ || Object.getPrototypeOf(AddressType)).apply(this, arguments));
  }

  _createClass(AddressType, null, [{
    key: 'EMPTY_ADDRESS',
    value: function EMPTY_ADDRESS() {
      return '0x0000000000000000000000000000000000000000';
    }
  }, {
    key: 'convertToRaw',
    value: function convertToRaw(value) {
      var errors = [];

      //this constant wil be resolved later
      if (value == '%SIGNER_ADDRESS%') return [errors, value];

      //null converts to 0x0000000000000000000000000000000000000000
      if (value === null) return [errors, AddressType.EMPTY_ADDRESS()];

      return [errors, value];
    }
  }, {
    key: 'convertFromRaw',
    value: function convertFromRaw(value) {
      if (value == AddressType.EMPTY_ADDRESS()) value = null;
      return value;
    }

    //todo: must be better way to get current addresses

  }, {
    key: 'converToRawExecTime',
    value: function converToRawExecTime(value, contract) {
      if (value == '%ENGINE_SIGNER%') value = contract.contract._eth.coinbase;
      //console.log (value);
      return value;
    }
  }]);

  return AddressType;
}(_RawType3.default);

exports.default = AddressType;