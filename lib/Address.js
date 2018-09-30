"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _bchaddrjs = require("bchaddrjs");

var _bchaddrjs2 = _interopRequireDefault(_bchaddrjs);

var _bitcoincashjsLib = require("bitcoincashjs-lib");

var _bitcoincashjsLib2 = _interopRequireDefault(_bitcoincashjsLib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Address = function () {
  function Address(restURL) {
    _classCallCheck(this, Address);

    this.restURL = restURL;
  }

  // Translate address from any address format into a specific format.


  _createClass(Address, [{
    key: "toLegacyAddress",
    value: function toLegacyAddress(address) {
      return _bchaddrjs2.default.toLegacyAddress(address);
    }
  }, {
    key: "toCashAddress",
    value: function toCashAddress(address) {
      var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (prefix) return _bchaddrjs2.default.toCashAddress(address);

      return _bchaddrjs2.default.toCashAddress(address).split(":")[1];
    }

    // Converts any address format to hash160

  }, {
    key: "toHash160",
    value: function toHash160(address) {
      var legacyAddress = _bchaddrjs2.default.toLegacyAddress(address);
      var bytes = _bitcoincashjsLib2.default.address.fromBase58Check(legacyAddress);
      return bytes.hash.toString("hex");
    }

    // Converts hash160 to Legacy Address

  }, {
    key: "hash160ToLegacy",
    value: function hash160ToLegacy(hash160) {
      var network = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _bitcoincashjsLib2.default.networks.bitcoin.pubKeyHash;

      var buffer = Buffer(hash160, "hex");
      var legacyAddress = _bitcoincashjsLib2.default.address.toBase58Check(buffer, network);
      return legacyAddress;
    }

    // Converts hash160 to Cash Address

  }, {
    key: "hash160ToCash",
    value: function hash160ToCash(hash160) {
      var network = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _bitcoincashjsLib2.default.networks.bitcoin.pubKeyHash;

      var legacyAddress = this.hash160ToLegacy(hash160, network);
      return this.toCashAddress(legacyAddress);
    }

    // Test for address format.

  }, {
    key: "isLegacyAddress",
    value: function isLegacyAddress(address) {
      return _bchaddrjs2.default.isLegacyAddress(address);
    }
  }, {
    key: "isCashAddress",
    value: function isCashAddress(address) {
      return _bchaddrjs2.default.isCashAddress(address);
    }

    // Test for address network.

  }, {
    key: "isMainnetAddress",
    value: function isMainnetAddress(address) {
      if (address[0] === "x") return true;else if (address[0] === "t") return false;

      return _bchaddrjs2.default.isMainnetAddress(address);
    }
  }, {
    key: "isTestnetAddress",
    value: function isTestnetAddress(address) {
      if (address[0] === "x") return false;else if (address[0] === "t") return true;

      return _bchaddrjs2.default.isTestnetAddress(address);
    }

    // Test for address type.

  }, {
    key: "isP2PKHAddress",
    value: function isP2PKHAddress(address) {
      return _bchaddrjs2.default.isP2PKHAddress(address);
    }
  }, {
    key: "isP2SHAddress",
    value: function isP2SHAddress(address) {
      return _bchaddrjs2.default.isP2SHAddress(address);
    }

    // Detect address format.

  }, {
    key: "detectAddressFormat",
    value: function detectAddressFormat(address) {
      return _bchaddrjs2.default.detectAddressFormat(address);
    }

    // Detect address network.

  }, {
    key: "detectAddressNetwork",
    value: function detectAddressNetwork(address) {
      if (address[0] === "x") return "mainnet";else if (address[0] === "t") return "testnet";

      return _bchaddrjs2.default.detectAddressNetwork(address);
    }

    // Detect address type.

  }, {
    key: "detectAddressType",
    value: function detectAddressType(address) {
      return _bchaddrjs2.default.detectAddressType(address);
    }
  }, {
    key: "fromXPub",
    value: function fromXPub(xpub) {
      var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "0/0";

      var HDNode = _bitcoincashjsLib2.default.HDNode.fromBase58(xpub, _bitcoincashjsLib2.default.networks[this.detectAddressNetwork(xpub)]);
      var address = HDNode.derivePath(path);
      return this.toCashAddress(address.getAddress());
    }
  }, {
    key: "fromOutputScript",
    value: function fromOutputScript(scriptPubKey) {
      var network = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "bitcoincash";

      var netParam = void 0;
      if (network !== "bitcoincash") netParam = _bitcoincashjsLib2.default.networks.testnet;

      return _bchaddrjs2.default.toCashAddress(_bitcoincashjsLib2.default.address.fromOutputScript(scriptPubKey, netParam));
    }
  }, {
    key: "details",
    value: async function details(address) {
      if (typeof address !== "string") address = JSON.stringify(address);

      try {
        var response = await _axios2.default.get(this.restURL + "address/details/" + address);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "utxo",
    value: async function utxo(address) {
      if (typeof address !== "string") address = JSON.stringify(address);

      try {
        var response = await _axios2.default.get(this.restURL + "address/utxo/" + address);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "unconfirmed",
    value: async function unconfirmed(address) {
      if (typeof address !== "string") address = JSON.stringify(address);

      try {
        var response = await _axios2.default.get(this.restURL + "address/unconfirmed/" + address);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }]);

  return Address;
}();

exports.default = Address;