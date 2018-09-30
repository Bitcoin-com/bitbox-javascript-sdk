"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Price = function () {
  function Price() {
    _classCallCheck(this, Price);
  }

  _createClass(Price, [{
    key: "current",
    value: async function current() {
      var currency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "all";

      try {
        var response = await _axios2.default.get("https://www.blocktrail.com/BCC/json/blockchain/price");
        if (currency === "all") return response.data;

        return response.data[currency.toUpperCase()];
      } catch (error) {
        throw error.response.data;
      }
    }
  }]);

  return Price;
}();

exports.default = Price;