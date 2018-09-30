"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bitcoincashjsLib = require("bitcoincashjs-lib");

var _bitcoincashjsLib2 = _interopRequireDefault(_bitcoincashjsLib);

var _bchaddrjs = require("bchaddrjs");

var _bchaddrjs2 = _interopRequireDefault(_bchaddrjs);

var _satoshiBitcoin = require("satoshi-bitcoin");

var _satoshiBitcoin2 = _interopRequireDefault(_satoshiBitcoin);

var _bitcoinjsMessage = require("bitcoinjs-message");

var _bitcoinjsMessage2 = _interopRequireDefault(_bitcoinjsMessage);

var _bs = require("bs58");

var _bs2 = _interopRequireDefault(_bs);

var _bip = require("bip21");

var _bip2 = _interopRequireDefault(_bip);

var _coininfo = require("coininfo");

var _coininfo2 = _interopRequireDefault(_coininfo);

var _bip3 = require("bip38");

var _bip4 = _interopRequireDefault(_bip3);

var _wif = require("wif");

var _wif2 = _interopRequireDefault(_wif);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = require("safe-buffer").Buffer;

var BitcoinCash = function () {
  function BitcoinCash() {
    _classCallCheck(this, BitcoinCash);
  }

  _createClass(BitcoinCash, [{
    key: "toSatoshi",

    // Translate coins to satoshi value
    value: function toSatoshi(coins) {
      return _satoshiBitcoin2.default.toSatoshi(coins);
    }

    // Translate satoshi to coin value

  }, {
    key: "toBitcoinCash",
    value: function toBitcoinCash(satoshis) {
      return _satoshiBitcoin2.default.toBitcoin(satoshis);
    }

    // Translate satoshi to bits denomination

  }, {
    key: "toBits",
    value: function toBits(satoshis) {
      return parseFloat(satoshis) / 100;
    }

    // Translate satoshi to bits denomination
    // TODO remove in 2.0

  }, {
    key: "satsToBits",
    value: function satsToBits(satoshis) {
      return parseFloat(satoshis) / 100;
    }

    // Translate bits to satoshi denomination
    // TODO remove in 2.0
    // fromBits(bits) {
    //   return this.toInteger(bits * 100);
    // }
    //
    // // Translate bits to satoshi denomination
    // satsFromBits(bits) {
    //   return this.toInteger(bits * 100);
    // }
    //
    // toInteger(number){
    //   return Math.round(  // round to nearest integer
    //     Number(number)    // type cast your input
    //   );
    // }

    // sign message

  }, {
    key: "signMessageWithPrivKey",
    value: function signMessageWithPrivKey(privateKeyWIF, message) {
      var network = privateKeyWIF.charAt(0) === "c" ? "testnet" : "bitcoincash";
      var bitcoincash = void 0;
      if (network === "bitcoincash") bitcoincash = _coininfo2.default.bitcoincash.main;else bitcoincash = _coininfo2.default.bitcoincash.test;

      var bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS();
      var keyPair = _bitcoincashjsLib2.default.ECPair.fromWIF(privateKeyWIF, bitcoincashBitcoinJSLib);
      var privateKey = keyPair.d.toBuffer(32);
      return _bitcoinjsMessage2.default.sign(message, privateKey, keyPair.compressed).toString("base64");
    }

    // verify message

  }, {
    key: "verifyMessage",
    value: function verifyMessage(address, signature, message) {
      return _bitcoinjsMessage2.default.verify(message, _bchaddrjs2.default.toLegacyAddress(address), signature);
    }

    // encode base58Check

  }, {
    key: "encodeBase58Check",
    value: function encodeBase58Check(hex) {
      return _bs2.default.encode(Buffer.from(hex, "hex"));
    }

    // decode base58Check

  }, {
    key: "decodeBase58Check",
    value: function decodeBase58Check(address) {
      return _bs2.default.decode(address).toString("hex");
    }

    // encode bip21 url

  }, {
    key: "encodeBIP21",
    value: function encodeBIP21(address, options) {
      return _bip2.default.encode(_bchaddrjs2.default.toCashAddress(address), options);
    }

    // decode bip21 url

  }, {
    key: "decodeBIP21",
    value: function decodeBIP21(url) {
      return _bip2.default.decode(url);
    }
  }, {
    key: "getByteCount",
    value: function getByteCount(inputs, outputs) {
      // from https://github.com/bitcoinjs/bitcoinjs-lib/issues/921#issuecomment-354394004
      var totalWeight = 0;
      var hasWitness = false;
      // assumes compressed pubkeys in all cases.
      var types = {
        inputs: {
          "MULTISIG-P2SH": 49 * 4,
          "MULTISIG-P2WSH": 6 + 41 * 4,
          "MULTISIG-P2SH-P2WSH": 6 + 76 * 4,
          P2PKH: 148 * 4,
          P2WPKH: 108 + 41 * 4,
          "P2SH-P2WPKH": 108 + 64 * 4
        },
        outputs: {
          P2SH: 32 * 4,
          P2PKH: 34 * 4,
          P2WPKH: 31 * 4,
          P2WSH: 43 * 4
        }
      };

      Object.keys(inputs).forEach(function (key) {
        if (key.slice(0, 8) === "MULTISIG") {
          // ex. "MULTISIG-P2SH:2-3" would mean 2 of 3 P2SH MULTISIG
          var keyParts = key.split(":");
          if (keyParts.length !== 2) throw new Error("invalid input: " + key);
          var newKey = keyParts[0];
          var mAndN = keyParts[1].split("-").map(function (item) {
            return parseInt(item);
          });

          totalWeight += types.inputs[newKey] * inputs[key];
          var multiplyer = newKey === "MULTISIG-P2SH" ? 4 : 1;
          totalWeight += (73 * mAndN[0] + 34 * mAndN[1]) * multiplyer;
        } else {
          totalWeight += types.inputs[key] * inputs[key];
        }
        if (key.indexOf("W") >= 0) hasWitness = true;
      });

      Object.keys(outputs).forEach(function (key) {
        totalWeight += types.outputs[key] * outputs[key];
      });

      if (hasWitness) totalWeight += 2;

      totalWeight += 10 * 4;

      return Math.ceil(totalWeight / 4);
    }
  }, {
    key: "encryptBIP38",
    value: function encryptBIP38(privKeyWIF, passphrase) {
      var decoded = _wif2.default.decode(privKeyWIF);

      return _bip4.default.encrypt(decoded.privateKey, decoded.compressed, passphrase);
    }
  }, {
    key: "decryptBIP38",
    value: function decryptBIP38(encryptedKey, passphrase) {
      var network = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "mainnet";

      var decryptedKey = _bip4.default.decrypt(encryptedKey, passphrase);
      var prefix = void 0;
      if (network === "testnet") prefix = 0xef;else prefix = 0x80;

      return _wif2.default.encode(prefix, decryptedKey.privateKey, decryptedKey.compressed);
    }
  }]);

  return BitcoinCash;
}();

exports.default = BitcoinCash;