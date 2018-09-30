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

var _bip = require("bip66");

var _bip2 = _interopRequireDefault(_bip);

var _bip3 = require("bip68");

var _bip4 = _interopRequireDefault(_bip3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TransactionBuilder = function () {
  function TransactionBuilder() {
    var network = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "bitcoincash";

    _classCallCheck(this, TransactionBuilder);

    var bitcoincash = void 0;
    if (network === "bitcoincash") bitcoincash = _coininfo2.default.bitcoincash.main;else bitcoincash = _coininfo2.default.bitcoincash.test;

    var bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS();
    this.transaction = new _bitcoincashjsLib2.default.TransactionBuilder(bitcoincashBitcoinJSLib);
    this.DEFAULT_SEQUENCE = 0xffffffff;
    this.hashTypes = {
      SIGHASH_ALL: 0x01,
      SIGHASH_NONE: 0x02,
      SIGHASH_SINGLE: 0x03,
      SIGHASH_ANYONECANPAY: 0x80,
      SIGHASH_BITCOINCASH_BIP143: 0x40,
      ADVANCED_TRANSACTION_MARKER: 0x00,
      ADVANCED_TRANSACTION_FLAG: 0x01
    };
    this.bip66 = _bip2.default;
    this.bip68 = _bip4.default;
    this.p2shInput = false;
    this.tx;
  }

  _createClass(TransactionBuilder, [{
    key: "addInput",
    value: function addInput(txHash, vout) {
      var sequence = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.DEFAULT_SEQUENCE;
      var prevOutScript = arguments[3];

      this.transaction.addInput(txHash, vout, sequence, prevOutScript);
    }
  }, {
    key: "addInputScript",
    value: function addInputScript(vout, script) {
      this.tx = this.transaction.buildIncomplete();
      this.tx.setInputScript(vout, script);
      this.p2shInput = true;
    }
  }, {
    key: "addOutput",
    value: function addOutput(scriptPubKey, amount) {
      try {
        this.transaction.addOutput(_bchaddrjs2.default.toLegacyAddress(scriptPubKey), amount);
      } catch (error) {
        this.transaction.addOutput(scriptPubKey, amount);
      }
    }
  }, {
    key: "sign",
    value: function sign(vin, keyPair, redeemScript) {
      var hashType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : this.hashTypes.SIGHASH_ALL;
      var value = arguments[4];

      var witnessScript = void 0;

      this.transaction.sign(vin, keyPair, redeemScript, hashType, value, witnessScript);
    }
  }, {
    key: "build",
    value: function build() {
      if (this.p2shInput === true) return this.tx;

      return this.transaction.build();
    }
  }]);

  return TransactionBuilder;
}();

exports.default = TransactionBuilder;