'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _CollectionProperty = require('./CollectionProperty');

var _CollectionProperty2 = _interopRequireDefault(_CollectionProperty);

var _ScalarProperty = require('./ScalarProperty');

var _ScalarProperty2 = _interopRequireDefault(_ScalarProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 _automatic_ property is:
 - public scalar storage variable (getter constant function )  http://solidity.readthedocs.io/en/develop/contracts.html#getter-functions
 - public array storage variable
 - public constant function without arguments and modifiers

 property is always one or more constant functions

 */
var PropertyMapper = function () {
  function PropertyMapper(contract, structure) {
    _classCallCheck(this, PropertyMapper);

    this._contract = contract;
    this._structure = structure;

    this._properties = {};
    this._propertyNames = null;
  }

  /**
   * Array of contract property names, now its all constant function without args ot array access functions
   * @returns {null|Array}
   */


  _createClass(PropertyMapper, [{
    key: 'getPropertyNames',
    value: function getPropertyNames() {

      if (Array.isArray(this._propertyNames)) return this._propertyNames;

      this._propertyNames = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._structure.getConstantMethods()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var method = _step.value;

          // console.log (method);
          var propertyName = this.getPropertyForMethod(method);
          if (propertyName) this._propertyNames.push(propertyName);
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

      return this._propertyNames;
    }
  }, {
    key: 'getPropertyForMethod',
    value: function getPropertyForMethod(method) {
      if (method.isArrayAccess) return method.name + 's';
      if (this.methodIsScalarProperty(method)) return method.name;
      return false;
    }
  }, {
    key: 'methodIsScalarProperty',
    value: function methodIsScalarProperty(method) {
      return method.inputs.length == 0 && !method.name.endsWith('Size');
    }

    /**
     * Returns array of contract properties object
     * @returns {*|Array}
     */

  }, {
    key: 'all',
    value: function all() {
      var _this = this;

      //TODO: add caching
      return this.getPropertyNames().map(function (propertyName) {
        return _this.get(propertyName);
      });
    }
  }, {
    key: 'has',
    value: function has(propertyName) {
      var returnMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;


      if (this._properties[propertyName] != undefined) return true;

      var method = this._structure.getMethod(propertyName);
      if (method && this.methodIsScalarProperty(method)) return returnMethod ? method : true;

      if (propertyName.endsWith('s')) {
        var _method = this._structure.getMethod(propertyName.slice(0, -1));
        if (_method && _method.isArrayAccess) return returnMethod ? _method : true;
      }

      return false;
    }
  }, {
    key: 'get',
    value: function get(propertyName) {
      if (this._properties[propertyName]) return this._properties[propertyName];
      var method = this.has(propertyName, true);

      if (!method) throw new Error('Property "' + propertyName + '" not defined');

      this._properties[propertyName] = method.isArrayAccess ? new _CollectionProperty2.default(propertyName, this._contract, {
        get: method,
        size: this._structure.getMethod(method.name + 'Size'),
        add: this._structure.getMethod(method.name + 'Add')
      }) : new _ScalarProperty2.default(propertyName, this._contract, {
        get: method
      });

      return this._properties[propertyName];
    }

    /**
     * JSON representation of contract properties (Promise)
     * @returns {Promise}
     */

  }, {
    key: 'toJSON',
    value: function toJSON() {

      var properties = this.all();

      //returns resolved toJSON for all properties
      return Promise.all(properties.map(function (property) {
        return property.toJSON();
      }))
      //make json with key : value
      .then(function (propertyJsons) {
        return properties.reduce(function (json, property, propertyPos) {
          return Object.assign(json, _defineProperty({}, property.name, propertyJsons[propertyPos]));
        }, {});
      });
    }
  }, {
    key: 'fromJSONMethodCalls',
    value: function fromJSONMethodCalls(json) {
      var _this2 = this;

      var errors = [],
          methodCalls = [];
      var constructorMethod = this._structure.getConstructor();

      if (constructorMethod) {
        methodCalls.push(constructorMethod.createCall());
        //Search for constructor args
        Object.keys(json).filter(function (key) {
          return constructorMethod.hasInputLike(key);
        }).forEach(function (key) {
          methodCalls[0].addKeyValueArg(key, json[key]);
          delete json[key];
        });
      }

      Object.keys(json).filter(function (key) {
        return _this2.has(key);
      }).forEach(function (key) {
        var _get$fromJSON = _this2.get(key).fromJSON(json[key]),
            _get$fromJSON2 = _slicedToArray(_get$fromJSON, 2),
            propErrors = _get$fromJSON2[0],
            propMethodCalls = _get$fromJSON2[1];

        errors.push.apply(errors, _toConsumableArray(propErrors));
        methodCalls.push.apply(methodCalls, _toConsumableArray(propMethodCalls));
        delete json[key];
      });

      methodCalls.forEach(function (methodCall) {
        var _methodCall$convertAr = methodCall.convertArgs(),
            _methodCall$convertAr2 = _slicedToArray(_methodCall$convertAr, 2),
            methodArgsErrors = _methodCall$convertAr2[0],
            args = _methodCall$convertAr2[1];

        if (methodArgsErrors) errors.push.apply(errors, _toConsumableArray(methodArgsErrors));
      });

      Object.keys(json).forEach(function (key) {
        return errors.push('Can\'t find constructor argument or property for json attribute "' + key + '"');
      });
      return [errors, methodCalls];
    }
  }]);

  return PropertyMapper;
}();

exports.default = PropertyMapper;