'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Property2 = require('./Property');

var _Property3 = _interopRequireDefault(_Property2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CollectionProperty = function (_Property) {
  _inherits(CollectionProperty, _Property);

  function CollectionProperty(name, contract, _ref) {
    var get = _ref.get,
        sizeMethod = _ref.size,
        addMethod = _ref.add,
        removeMethod = _ref.remove;

    _classCallCheck(this, CollectionProperty);

    var _this = _possibleConstructorReturn(this, (CollectionProperty.__proto__ || Object.getPrototypeOf(CollectionProperty)).call(this, name, contract, { get: get }));

    _this.sizeMethod = sizeMethod;
    _this.addMethod = addMethod;
    _this.removeMethod = removeMethod;
    return _this;
  }

  _createClass(CollectionProperty, [{
    key: 'size',
    value: function size() {
      return this.contract.address ? this.contract[this.sizeMethod.name]() : Promise.resolve(null);
    }
  }, {
    key: 'add',
    value: function add() {
      var _this2 = this;

      for (var _len = arguments.length, itemArgs = Array(_len), _key = 0; _key < _len; _key++) {
        itemArgs[_key] = arguments[_key];
      }

      return Promise.all(itemArgs.map(function (itemArg) {
        //console.log ('Call method ',this.addMethod, 'with args', itemArg);
        return _this2.contract[_this2.addMethod.name](itemArg);
      }));
    }
  }, {
    key: 'get',
    value: function get() {
      var _this3 = this;

      var pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      if (!this.contract.address) return Promise.resolve(null);
      if (pos != undefined) return this.contract[this.getMethod.name](pos);
      return this.size()
      // array of promises, getting all positions for 0 to size
      .then(function (size) {
        return Promise.all(Array.from(Array(size).keys()).map(function (pos) {
          return _this3.get(pos);
        }));
      });
    }
  }, {
    key: 'remove',
    value: function remove(pos) {
      if (!this.contract.address) throw new Error('Canr remove property item for contract without address');
      return this.contract[this.removeMethod.name](pos);
    }
  }, {
    key: 'fromJSON',
    value: function fromJSON(json) {
      var _this4 = this;

      var errors = [],
          methodCalls = [];

      if (!this.addMethod) errors.push('Can\'t add value to property "' + this.name + '"');else if (!Array.isArray(json)) errors.push('Value of property "' + this.name + '" must be an array');else {
        json.forEach(function (val) {
          return methodCalls.push(_this4.addMethod.createCall(val));
        });
      }

      return [errors, methodCalls];
    }
  }]);

  return CollectionProperty;
}(_Property3.default);

exports.default = CollectionProperty;