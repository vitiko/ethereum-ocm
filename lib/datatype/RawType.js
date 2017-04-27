"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RawType = function () {
  function RawType() {
    _classCallCheck(this, RawType);
  }

  _createClass(RawType, null, [{
    key: "convertFromRaw",


    /**
     * Converts FROM ethereum raw value
     * @param value
     * @returns {*}
     */
    value: function convertFromRaw(value) {
      return value;
    }

    /**
     * Validates and converts TO ethereum raw value
     * @param value
     * @returns {*}
     */

  }, {
    key: "convertToRaw",
    value: function convertToRaw(value) {
      var errors = [];
      return [errors, value];
    }
  }, {
    key: "validate",
    value: function validate(value) {
      return this.convertToRaw(value)[0];
    }

    /**
     * Common round function for all derived types
     */

  }, {
    key: "roundNumber",
    value: function roundNumber(value) {
      return Math.round(value);
    }

    /**
     * In ethereum datetimes storing in seconds
     * @param ms
     * @returns {*}
     */

  }, {
    key: "fromMilliseconds",
    value: function fromMilliseconds(ms) {
      return this.roundNumber(ms / 1000);
    }
  }]);

  return RawType;
}();

exports.default = RawType;