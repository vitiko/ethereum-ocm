'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _IntegerType2 = require('./IntegerType');

var _IntegerType3 = _interopRequireDefault(_IntegerType2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DateTimeType = function (_IntegerType) {
  _inherits(DateTimeType, _IntegerType);

  function DateTimeType() {
    _classCallCheck(this, DateTimeType);

    return _possibleConstructorReturn(this, (DateTimeType.__proto__ || Object.getPrototypeOf(DateTimeType)).apply(this, arguments));
  }

  _createClass(DateTimeType, null, [{
    key: 'convertFromRaw',
    value: function convertFromRaw(value) {
      value = _get(DateTimeType.__proto__ || Object.getPrototypeOf(DateTimeType), 'convertFromRaw', this).call(this, value);
      return value ? new Date(value * 1000) : null;
    }
  }, {
    key: 'convertToRaw',
    value: function convertToRaw(value) {

      if (typeof value == 'string') {
        var timestamp = Date.parse(value);
        if (isNaN(timestamp)) return [['Invalid date format: ' + value], value];else return [[], this.fromMilliseconds(value)];
      }

      if (value instanceof Date) return [[], this.fromMilliseconds(value.getTime())];

      //check integer
      return _get(DateTimeType.__proto__ || Object.getPrototypeOf(DateTimeType), 'convertToRaw', this).call(this, value);
    }
  }]);

  return DateTimeType;
}(_IntegerType3.default);

exports.default = DateTimeType;