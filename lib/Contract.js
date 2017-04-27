'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

//import Web3 from 'web3';

var _truffleContract = require('truffle-contract');

var _truffleContract2 = _interopRequireDefault(_truffleContract);

var _ContractStructure = require('./ContractStructure');

var _ContractStructure2 = _interopRequireDefault(_ContractStructure);

var _PropertyMapper = require('./property/PropertyMapper');

var _PropertyMapper2 = _interopRequireDefault(_PropertyMapper);

var _MethodProxy = require('./method/MethodProxy');

var _MethodProxy2 = _interopRequireDefault(_MethodProxy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Contract = function () {
  function Contract(_ref) {
    var _this = this;

    var truffleContract = _ref.truffleContract,
        data = _ref.data,
        dataPath = _ref.dataPath,
        sourcePath = _ref.sourcePath,
        sourceStructure = _ref.sourceStructure,
        provider = _ref.provider,
        abi = _ref.abi,
        abiHints = _ref.abiHints;

    _classCallCheck(this, Contract);

    //decorate existing contract with address
    if (truffleContract) {
      this.contract = truffleContract;
    } else {
      //if we not have contract object we need data (abi, unlinked_binary etc for create it)
      if (!data && dataPath) data = require(dataPath);
      if (!data && abi) data.abi = abi;

      if (!data) throw new Errror('data{ abi, unlinked binary .. etc} or dataPath must be provided');

      //data.sourceStructure can already be in data or not
      this.contract = truffleContract = (0, _truffleContract2.default)(data);
    }

    this.structure = new _ContractStructure2.default({ truffleContract: truffleContract, sourceStructure: sourceStructure, sourcePath: sourcePath, abiHints: abiHints });
    this._methodProxy = new _MethodProxy2.default(this.contract, this.structure);
    this._propertyMapper = new _PropertyMapper2.default(this, this.structure);

    this.contract.abi.forEach(function (methodABI) {
      _this[methodABI.name] = function methodProxy() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return this._methodProxy.execute(methodABI.name, args);
      };
    });

    if (provider) this.contract.setProvider(provider);
  }

  _createClass(Contract, [{
    key: 'hasMethod',
    value: function hasMethod(methodName) {
      return typeof this[methodName] == 'function' && this[methodName].name == 'methodProxy';
    }
  }, {
    key: 'createFromTruffleContract',
    value: function createFromTruffleContract(truffleContract) {
      //todo: export can be not sourceStructure !! (derived fro abi and abiHints )
      return new Contract({ truffleContract: truffleContract, sourceStructure: this.structure.export() });
    }

    //todo: update contract instance

  }, {
    key: 'update',
    value: function update() {}

    //todo: validate method call args

  }, {
    key: 'validate',
    value: function validate() {}
  }, {
    key: 'checkDefaults',
    value: function checkDefaults() {
      if (!this.contract.class_defaults.from) {
        this.contract.defaults({
          gas: 4200000,
          from: this.contract.web3.eth.coinbase
        });

        this.contract.setNetwork(this.contract.web3.version.network);
      }
    }

    /**
     *
     * @returns {*|Array}
     */

  }, {
    key: 'properties',
    value: function properties() {
      return this._propertyMapper.all();
    }
  }, {
    key: 'property',
    value: function property(propertyName) {
      return this._propertyMapper.get(propertyName);
    }
  }, {
    key: 'toJSON',
    value: function toJSON() {
      return this._propertyMapper.toJSON();
    }
  }, {
    key: 'fromJSON',
    value: function () {
      var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(json) {
        var errors, methodCalls, constructorArgs, _propertyMapper$fromJ, _propertyMapper$fromJ2, contract, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, methodCall;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                errors = void 0, methodCalls = void 0, constructorArgs = void 0;

                //Sync code here

                _context.prev = 1;

                if (typeof json == 'string') json = JSON.parse(json);

                _propertyMapper$fromJ = this._propertyMapper.fromJSONMethodCalls(json);
                _propertyMapper$fromJ2 = _slicedToArray(_propertyMapper$fromJ, 2);
                errors = _propertyMapper$fromJ2[0];
                methodCalls = _propertyMapper$fromJ2[1];

                if (!errors.length) {
                  _context.next = 9;
                  break;
                }

                throw new Error(errors.join(';\n'));

              case 9:

                constructorArgs = methodCalls.length && methodCalls[0].method.name == 'constructor' ? methodCalls.shift().args : [];
                _context.next = 15;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context['catch'](1);
                return _context.abrupt('return', Promise.reject(_context.t0.message));

              case 15:
                _context.next = 17;
                return this.new.apply(this, _toConsumableArray(constructorArgs));

              case 17:
                contract = _context.sent;


                //calls must be executed in same order
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 21;
                _iterator = methodCalls[Symbol.iterator]();

              case 23:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 30;
                  break;
                }

                methodCall = _step.value;
                _context.next = 27;
                return contract._methodProxy.executeMethodCall(methodCall);

              case 27:
                _iteratorNormalCompletion = true;
                _context.next = 23;
                break;

              case 30:
                _context.next = 36;
                break;

              case 32:
                _context.prev = 32;
                _context.t1 = _context['catch'](21);
                _didIteratorError = true;
                _iteratorError = _context.t1;

              case 36:
                _context.prev = 36;
                _context.prev = 37;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 39:
                _context.prev = 39;

                if (!_didIteratorError) {
                  _context.next = 42;
                  break;
                }

                throw _iteratorError;

              case 42:
                return _context.finish(39);

              case 43:
                return _context.finish(36);

              case 44:
                return _context.abrupt('return', contract);

              case 45:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 12], [21, 32, 36, 44], [37,, 39, 43]]);
      }));

      function fromJSON(_x) {
        return _ref2.apply(this, arguments);
      }

      return fromJSON;
    }()

    //Proxying to underliing object

  }, {
    key: 'new',
    value: function _new() {
      var _contract,
          _this2 = this;

      this.checkDefaults();
      return (_contract = this.contract).new.apply(_contract, arguments).then(function (truffleContract) {
        return _this2.createFromTruffleContract(truffleContract);
      });
    }
  }, {
    key: 'at',
    value: function at() {
      var _contract2,
          _this3 = this;

      this.checkDefaults();
      return (_contract2 = this.contract).at.apply(_contract2, arguments).then(function (truffleContract) {
        return _this3.createFromTruffleContract(truffleContract);
      });
    }
  }, {
    key: 'deployed',
    value: function deployed() {
      var _contract3,
          _this4 = this;

      this.checkDefaults();
      return (_contract3 = this.contract).deployed.apply(_contract3, arguments).then(function (truffleContract) {
        return truffleContract ? _this4.createFromTruffleContract(truffleContract) : truffleContract;
      });
    }
  }, {
    key: 'isDeployed',
    value: function isDeployed() {
      this.checkDefaults();

      /*
       this.contract.detectNetwork();
        this.contract.deployed().then ( a => console.log (a));*/

      return this.contract.isDeployed();
    }
  }, {
    key: 'address',
    get: function get() {
      var address = undefined;
      try {
        address = this.contract.address;
      } catch (e) {
        address = undefined;
      }
      return address;
    }
  }, {
    key: 'status',
    get: function get() {

      return {
        isDeployed: this.isDeployed(),
        address: this.address
      };
    }
  }]);

  return Contract;
}();

exports.default = Contract;