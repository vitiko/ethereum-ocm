'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectType = detectType;
exports.detectExecTimeType = detectExecTimeType;
exports.convertFromRaw = convertFromRaw;
exports.convertToRaw = convertToRaw;
exports.execTimeReplaceConstants = execTimeReplaceConstants;
exports.validate = validate;

var _RawType = require('./RawType');

var _RawType2 = _interopRequireDefault(_RawType);

var _DateTimeType = require('./DateTimeType');

var _DateTimeType2 = _interopRequireDefault(_DateTimeType);

var _IntegerType = require('./IntegerType');

var _IntegerType2 = _interopRequireDefault(_IntegerType);

var _PercentType = require('./PercentType');

var _PercentType2 = _interopRequireDefault(_PercentType);

var _AddressType = require('./AddressType');

var _AddressType2 = _interopRequireDefault(_AddressType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function detectType(type, typeHint) {

  if (type.substr(0, 4) == 'uint') {
    if (typeHint == 'DateTime') return _DateTimeType2.default;
    if (typeHint == 'Percent') return _PercentType2.default;else return _IntegerType2.default;
  }

  if (type == 'address') return _AddressType2.default;

  return _RawType2.default;
}

function detectExecTimeType(type, typeHint) {

  if (type == 'address') return _AddressType2.default;
}

function convertFromRaw(type, typeHint, value) {

  return detectType(type, typeHint).convertFromRaw(value);
}

function convertToRaw(type, typeHint, value) {
  return detectType(type, typeHint).convertToRaw(value);
}

function execTimeReplaceConstants(type, typeHint, value, contract) {
  var execTimeConvert = detectExecTimeType(type, typeHint);
  return execTimeConvert ? execTimeConvert.converToRawExecTime(value, contract) : value;
}

function validate(type, typeHint, value) {
  return detectType(type, typeHint).validate(value);
}