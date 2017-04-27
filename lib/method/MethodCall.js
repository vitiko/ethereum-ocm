'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _datatype = require('../datatype');

var DataType = _interopRequireWildcard(_datatype);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MethodCall = function () {
  function MethodCall(method, args) {
    _classCallCheck(this, MethodCall);

    this._method = method;
    this._args = args;
    this._convertedArgs = undefined;
    this._errors = undefined;
    this._rawResult = undefined;
  }

  _createClass(MethodCall, [{
    key: 'addKeyValueArg',
    value: function addKeyValueArg(key, value) {
      if (this._args == undefined) this._args = {};else if (Array.isArray(this._args)) throw new Error('Method arguments already set as array');

      this._args[key] = value;
    }

    /**
     * Execute method
     * @param truffleContract
     * @returns {*}
     */

  }, {
    key: 'execute',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(truffleContract) {
        var args;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (truffleContract[this._method.name]) {
                  _context.next = 2;
                  break;
                }

                throw new Error('Truffle contract not initialized. Before call must use function new, deployed, at, fromJSON');

              case 2:
                this.convertArgs();

                if (!this._errors.length) {
                  _context.next = 5;
                  break;
                }

                throw new TypeError(this._errors.join(';\n'));

              case 5:
                args = this.convertExecTimeArgs(this._convertedArgs, truffleContract);
                _context.next = 8;
                return truffleContract[this._method.name].apply(truffleContract, _toConsumableArray(args));

              case 8:
                this._rawResult = _context.sent;
                return _context.abrupt('return', this.getResult());

              case 10:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function execute(_x) {
        return _ref.apply(this, arguments);
      }

      return execute;
    }()

    /**
     * Not good second time iterate
     * @param args
     * @param contract
     * @returns {*}
     */

  }, {
    key: 'convertExecTimeArgs',
    value: function convertExecTimeArgs(args, contract) {
      var inputs = this._method.inputs;
      for (var inputPos in inputs) {
        var input = inputs[inputPos];
        args[inputPos] = DataType.execTimeReplaceConstants(input['type'], input['typeHint'], args[inputPos], contract);
      }

      return args;
    }

    /**
     * Convert from hashmap args to array
     * @param inputArgs
     */

  }, {
    key: 'convertHashArgsIfNeeded',
    value: function convertHashArgsIfNeeded(inputArgs) {
      if (!(inputArgs.length == 1 && _typeof(inputArgs[0]) == 'object' && !Array.isArray(inputArgs[0]))) return [[], inputArgs];
      inputArgs = inputArgs[0]; //first element is hashmap

      var args = [],
          errors = [];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(inputArgs)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var inputName = _step.value;

          var input = this._method.getInputByNameLike(inputName);

          if (!input) errors.push('Unknown input ' + inputName + ' for method ' + this._method.name);else args[input.pos] = inputArgs[inputName];
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

      return [errors, args];
    }

    /**
     * Convert from javascript type to ethereum types
     * @returns {{errors: Array, args: Array}}
     */

  }, {
    key: 'convertArgs',
    value: function convertArgs() {
      if (this._convertedArgs != undefined) return [this._errors, this._convertedArgs];

      var args = [],
          errors = [];
      //args can be setted via addKeyValueArg
      var inputArgs = this._args && !Array.isArray(this._args) ? [this._args] : this._args;

      var _convertHashArgsIfNee = this.convertHashArgsIfNeeded(inputArgs);

      var _convertHashArgsIfNee2 = _slicedToArray(_convertHashArgsIfNee, 2);

      errors = _convertHashArgsIfNee2[0];
      inputArgs = _convertHashArgsIfNee2[1];


      var inputs = this._method.inputs;
      for (var inputPos in inputs) {
        var _errors;

        var inputArg = inputArgs[inputPos];
        var input = inputs[inputPos];

        if (inputArg === undefined) {
          errors.push('Argument #' + inputPos + ' (' + input.name + ') for method ' + this.method.name + ' undefined');
          continue;
        }

        var _DataType$convertToRa = DataType.convertToRaw(input['type'], input['typeHint'], inputArg),
            _DataType$convertToRa2 = _slicedToArray(_DataType$convertToRa, 2),
            convertErrors = _DataType$convertToRa2[0],
            convertedValue = _DataType$convertToRa2[1];

        if (convertErrors.lentgh) (_errors = errors).push.apply(_errors, _toConsumableArray(convertErrors));else args[inputPos] = convertedValue;
      }

      this._convertedArgs = args;
      this._errors = errors;

      return [this._errors, this._convertedArgs];
    }
  }, {
    key: 'getResult',
    value: function getResult() {
      //transform only constant method returns
      if (this._method.constant) {
        return this.convertResult(this._rawResult);
      } else return this._rawResult;
    }
  }, {
    key: 'convertResult',
    value: function convertResult(result) {
      var toHash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      var outputs = this._method.outputs;

      if (outputs.length == 1) return DataType.convertFromRaw(outputs[0]['type'], outputs[0]['typeHint'], result);else {

        result = result.map(function (res, pos) {
          return DataType.convertFromRaw(outputs[pos]['type'], outputs[pos]['typeHint'], res);
        });
        if (toHash) result = result.reduce(function (hash, value, pos) {
          return Object.assign(hash, _defineProperty({}, outputs[pos].name, value));
        }, {});
        return result;
      }
    }
  }, {
    key: 'getRawResult',
    value: function getRawResult() {
      return this._rawResult;
    }
  }, {
    key: 'method',
    get: function get() {
      return this._method;
    }
  }, {
    key: 'args',
    get: function get() {
      this.convertArgs();
      return this._convertedArgs;
    }
  }, {
    key: 'errors',
    get: function get() {
      this.convertArgs();
      return this._errors;
    }
  }, {
    key: 'rawArgs',
    get: function get() {
      return this._args;
    }
  }]);

  return MethodCall;
}();

exports.default = MethodCall;