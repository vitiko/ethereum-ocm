"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Property = function () {
  function Property(name, contract, _ref) {
    var getMethod = _ref.get;

    _classCallCheck(this, Property);

    this.name = name;
    this.contract = contract;

    this.getMethod = getMethod;

    if (new.target === Property) throw new TypeError("Cannot construct Property instances directly");

    if (this.get === undefined) throw new TypeError('Property must implement "get"  method');
  }

  /**
   *
   * @returns {Promise}
   */


  _createClass(Property, [{
    key: "toJSON",
    value: function toJSON() {
      return this.get();
    }
  }]);

  return Property;
}();

exports.default = Property;