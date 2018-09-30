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

var _bip32Utils = require("bip32-utils");

var _bip32Utils2 = _interopRequireDefault(_bip32Utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HDNode = function () {
  function HDNode() {
    _classCallCheck(this, HDNode);
  }

  _createClass(HDNode, [{
    key: "fromSeed",
    value: function fromSeed(rootSeedBuffer) {
      var network = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "bitcoincash";

      var bitcoincash = void 0;
      if (network === "bitcoincash") bitcoincash = _coininfo2.default.bitcoincash.main;else bitcoincash = _coininfo2.default.bitcoincash.test;

      var bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS();
      return _bitcoincashjsLib2.default.HDNode.fromSeedBuffer(rootSeedBuffer, bitcoincashBitcoinJSLib);
    }
  }, {
    key: "toLegacyAddress",
    value: function toLegacyAddress(hdNode) {
      return hdNode.getAddress();
    }
  }, {
    key: "toCashAddress",
    value: function toCashAddress(hdNode) {
      return _bchaddrjs2.default.toCashAddress(hdNode.getAddress());
    }
  }, {
    key: "toWIF",
    value: function toWIF(hdNode) {
      return hdNode.keyPair.toWIF();
    }
  }, {
    key: "toXPub",
    value: function toXPub(hdNode) {
      return hdNode.neutered().toBase58();
    }
  }, {
    key: "toXPriv",
    value: function toXPriv(hdNode) {
      return hdNode.toBase58();
    }
  }, {
    key: "toKeyPair",
    value: function toKeyPair(hdNode) {
      return hdNode.keyPair;
    }
  }, {
    key: "toPublicKey",
    value: function toPublicKey(hdNode) {
      return hdNode.getPublicKeyBuffer();
    }
  }, {
    key: "fromXPriv",
    value: function fromXPriv(xpriv) {
      var bitcoincash = void 0;
      if (xpriv[0] === "x") bitcoincash = _coininfo2.default.bitcoincash.main;else if (xpriv[0] === "t") bitcoincash = _coininfo2.default.bitcoincash.test;

      var bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS();
      return _bitcoincashjsLib2.default.HDNode.fromBase58(xpriv, bitcoincashBitcoinJSLib);
    }
  }, {
    key: "fromXPub",
    value: function fromXPub(xpub) {
      var bitcoincash = void 0;
      if (xpub[0] === "x") bitcoincash = _coininfo2.default.bitcoincash.main;else if (xpub[0] === "t") bitcoincash = _coininfo2.default.bitcoincash.test;

      var bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS();
      return _bitcoincashjsLib2.default.HDNode.fromBase58(xpub, bitcoincashBitcoinJSLib);
    }
  }, {
    key: "derivePath",
    value: function derivePath(hdnode, path) {
      return hdnode.derivePath(path);
    }
  }, {
    key: "derive",
    value: function derive(hdnode, path) {
      return hdnode.derive(path);
    }
  }, {
    key: "deriveHardened",
    value: function deriveHardened(hdnode, path) {
      return hdnode.deriveHardened(path);
    }
  }, {
    key: "sign",
    value: function sign(hdnode, buffer) {
      return hdnode.sign(buffer);
    }
  }, {
    key: "verify",
    value: function verify(hdnode, buffer, signature) {
      return hdnode.verify(buffer, signature);
    }
  }, {
    key: "isPublic",
    value: function isPublic(hdnode) {
      return hdnode.isNeutered();
    }
  }, {
    key: "isPrivate",
    value: function isPrivate(hdnode) {
      return !hdnode.isNeutered();
    }
  }, {
    key: "toIdentifier",
    value: function toIdentifier(hdnode) {
      return hdnode.getIdentifier();
    }
  }, {
    key: "fromBase58",
    value: function fromBase58(base58, network) {
      return _bitcoincashjsLib2.default.HDNode.fromBase58(base58, network);
    }
  }, {
    key: "createAccount",
    value: function createAccount(hdNodes) {
      var arr = hdNodes.map(function (item, index) {
        return new _bip32Utils2.default.Chain(item.neutered());
      });
      return new _bip32Utils2.default.Account(arr);
    }
  }, {
    key: "createChain",
    value: function createChain(hdNode) {
      return new _bip32Utils2.default.Chain(hdNode);
    }
  }]);

  return HDNode;
}();

exports.default = HDNode;