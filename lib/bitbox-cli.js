"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _bitcoincashjsLib = require("bitcoincashjs-lib");

var _bitcoincashjsLib2 = _interopRequireDefault(_bitcoincashjsLib);

var _BitcoinCash = require("./BitcoinCash");

var _BitcoinCash2 = _interopRequireDefault(_BitcoinCash);

var _Crypto = require("./Crypto");

var _Crypto2 = _interopRequireDefault(_Crypto);

var _Util = require("./Util");

var _Util2 = _interopRequireDefault(_Util);

var _Block = require("./Block");

var _Block2 = _interopRequireDefault(_Block);

var _Blockchain = require("./Blockchain");

var _Blockchain2 = _interopRequireDefault(_Blockchain);

var _Control = require("./Control");

var _Control2 = _interopRequireDefault(_Control);

var _Generating = require("./Generating");

var _Generating2 = _interopRequireDefault(_Generating);

var _Mining = require("./Mining");

var _Mining2 = _interopRequireDefault(_Mining);

var _Network = require("./Network");

var _Network2 = _interopRequireDefault(_Network);

var _RawTransactions = require("./RawTransactions");

var _RawTransactions2 = _interopRequireDefault(_RawTransactions);

var _Mnemonic = require("./Mnemonic");

var _Mnemonic2 = _interopRequireDefault(_Mnemonic);

var _Address = require("./Address");

var _Address2 = _interopRequireDefault(_Address);

var _HDNode = require("./HDNode");

var _HDNode2 = _interopRequireDefault(_HDNode);

var _Transaction = require("./Transaction");

var _Transaction2 = _interopRequireDefault(_Transaction);

var _TransactionBuilder = require("./TransactionBuilder");

var _TransactionBuilder2 = _interopRequireDefault(_TransactionBuilder);

var _ECPair = require("./ECPair");

var _ECPair2 = _interopRequireDefault(_ECPair);

var _Script = require("./Script");

var _Script2 = _interopRequireDefault(_Script);

var _Price = require("./Price");

var _Price2 = _interopRequireDefault(_Price);

var _Socket = require("./Socket");

var _Socket2 = _interopRequireDefault(_Socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } // 3rd party deps


// local deps


var BITBOXCli = function BITBOXCli(config) {
  _classCallCheck(this, BITBOXCli);

  if (config && config.restURL && config.restURL !== "") this.restURL = config.restURL;else this.restURL = "https://rest.bitcoin.com/v1/";

  this.Address = new _Address2.default(this.restURL);
  this.BitcoinCash = new _BitcoinCash2.default();
  this.Block = new _Block2.default(this.restURL);
  this.Blockchain = new _Blockchain2.default(this.restURL);
  this.Control = new _Control2.default(this.restURL);
  this.Crypto = _Crypto2.default;
  this.ECPair = _ECPair2.default;
  this.Generating = new _Generating2.default(this.restURL);
  this.HDNode = new _HDNode2.default();
  this.Mining = new _Mining2.default(this.restURL);
  this.Mnemonic = new _Mnemonic2.default();
  this.Network = new _Network2.default(this.restURL);
  this.Price = new _Price2.default();
  this.RawTransactions = new _RawTransactions2.default(this.restURL);
  this.Script = new _Script2.default();
  this.Transaction = new _Transaction2.default(this.restURL);
  this.TransactionBuilder = _TransactionBuilder2.default;
  this.Util = new _Util2.default(this.restURL);
  this.Socket = _Socket2.default;
};

exports.default = BITBOXCli;