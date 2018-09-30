"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mining = function () {
  function Mining(restURL) {
    _classCallCheck(this, Mining);

    this.restURL = restURL;
  }

  _createClass(Mining, [{
    key: "getBlockTemplate",
    value: async function getBlockTemplate(template_request) {
      try {
        var response = await _axios2.default.get(this.restURL + "mining/getBlockTemplate/" + template_request);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getMiningInfo",
    value: async function getMiningInfo() {
      try {
        var response = await _axios2.default.get(this.restURL + "mining/getMiningInfo");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getNetworkHashps",
    value: async function getNetworkHashps() {
      var nblocks = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 120;
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      try {
        var response = await _axios2.default.get(this.restURL + "mining/getNetworkHashps?nblocks=" + nblocks + "&height=" + height);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "submitBlock",
    value: async function submitBlock(hex, parameters) {
      var path = this.restURL + "mining/submitBlock/" + hex;
      if (parameters) path = path + "?parameters=" + parameters;

      try {
        var response = await _axios2.default.post(path);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }]);

  return Mining;
}();

exports.default = Mining;