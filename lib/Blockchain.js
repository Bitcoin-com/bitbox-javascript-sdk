"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Blockchain = function () {
  function Blockchain(restURL) {
    _classCallCheck(this, Blockchain);

    this.restURL = restURL;
  }

  _createClass(Blockchain, [{
    key: "getBestBlockHash",
    value: async function getBestBlockHash() {
      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getBestBlockHash");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getBlock",
    value: async function getBlock(blockhash) {
      var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getBlock/" + blockhash + "?verbose=" + verbose);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getBlockchainInfo",
    value: async function getBlockchainInfo() {
      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getBlockchainInfo");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getBlockCount",
    value: async function getBlockCount() {
      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getBlockCount");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getBlockHash",
    value: async function getBlockHash() {
      var height = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

      if (typeof height !== "string") height = JSON.stringify(height);

      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getBlockHash/" + height);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getBlockHeader",
    value: async function getBlockHeader(hash) {
      var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (typeof hash !== "string") hash = JSON.stringify(hash);

      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getBlockHeader/" + hash + "?verbose=" + verbose);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getChainTips",
    value: async function getChainTips() {
      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getChainTips");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getDifficulty",
    value: async function getDifficulty() {
      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getDifficulty");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getMempoolAncestors",
    value: async function getMempoolAncestors(txid) {
      var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (typeof txid !== "string") txid = JSON.stringify(txid);

      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getMempoolAncestors/" + txid + "?verbose=" + verbose);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getMempoolDescendants",
    value: async function getMempoolDescendants(txid) {
      var verbose = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (typeof txid !== "string") txid = JSON.stringify(txid);

      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getMempoolDescendants/" + txid + "?verbose=" + verbose);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getMempoolEntry",
    value: async function getMempoolEntry(txid) {
      if (typeof txid !== "string") txid = JSON.stringify(txid);

      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getMempoolEntry/" + txid);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getMempoolInfo",
    value: async function getMempoolInfo() {
      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getMempoolInfo");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getRawMempool",
    value: async function getRawMempool() {
      var verbose = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getRawMempool?vebose=" + verbose);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getTxOut",
    value: async function getTxOut(txid, n) {
      var include_mempool = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/getTxOut/" + txid + "/n?include_mempool=" + include_mempool);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getTxOutProof",
    value: async function getTxOutProof(txids, blockhash) {
      var path = this.restURL + "blockchain/getTxOutProof/" + txids;
      if (blockhash) path = path + "?blockhash=" + blockhash;

      try {
        var response = await _axios2.default.get(path);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "preciousBlock",
    value: async function preciousBlock(blockhash) {
      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/preciousBlock/" + blockhash);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "pruneBlockchain",
    value: async function pruneBlockchain(height) {
      try {
        var response = await _axios2.default.post(this.restURL + "blockchain/pruneBlockchain/" + height);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "verifyChain",
    value: async function verifyChain() {
      var checklevel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 3;
      var nblocks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;

      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/verifyChain?checklevel=" + checklevel + "&nblocks=" + nblocks);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "verifyTxOutProof",
    value: async function verifyTxOutProof(proof) {
      try {
        var response = await _axios2.default.get(this.restURL + "blockchain/verifyTxOutProof/proof");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }]);

  return Blockchain;
}();

exports.default = Blockchain;