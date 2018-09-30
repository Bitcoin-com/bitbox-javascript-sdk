"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bitcoincashjsLib = require("bitcoincashjs-lib");

var _bitcoincashjsLib2 = _interopRequireDefault(_bitcoincashjsLib);

var _bchaddrjs = require("bchaddrjs");

var _bchaddrjs2 = _interopRequireDefault(_bchaddrjs);

var _coininfo = require("coininfo");

var _coininfo2 = _interopRequireDefault(_coininfo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ECPair = function () {
  function ECPair() {
    _classCallCheck(this, ECPair);
  }

  _createClass(ECPair, null, [{
    key: "fromWIF",
    value: function fromWIF(privateKeyWIF) {
      var network = void 0;
      if (privateKeyWIF[0] === "L" || privateKeyWIF[0] === "K") network = "bitcoincash";else if (privateKeyWIF[0] === "c") network = "testnet";

      var bitcoincash = void 0;
      if (network === "bitcoincash") bitcoincash = _coininfo2.default.bitcoincash.main;else bitcoincash = _coininfo2.default.bitcoincash.test;

      var bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS();

      return _bitcoincashjsLib2.default.ECPair.fromWIF(privateKeyWIF, bitcoincashBitcoinJSLib);
    }
  }, {
    key: "toWIF",
    value: function toWIF(ecpair) {
      return ecpair.toWIF();
    }
  }, {
    key: "sign",
    value: function sign(ecpair, buffer) {
      return ecpair.sign(buffer);
    }
  }, {
    key: "verify",
    value: function verify(ecpair, buffer, signature) {
      return ecpair.verify(buffer, signature);
    }
  }, {
    key: "fromPublicKey",
    value: function fromPublicKey(pubkeyBuffer) {
      return _bitcoincashjsLib2.default.ECPair.fromPublicKeyBuffer(pubkeyBuffer);
    }
  }, {
    key: "toPublicKey",
    value: function toPublicKey(ecpair) {
      return ecpair.getPublicKeyBuffer();
    }
  }, {
    key: "toLegacyAddress",
    value: function toLegacyAddress(ecpair) {
      return ecpair.getAddress();
    }
  }, {
    key: "toCashAddress",
    value: function toCashAddress(ecpair) {
      return _bchaddrjs2.default.toCashAddress(ecpair.getAddress());
    }
  }]);

  return ECPair;
}();

exports.default = ECPair;