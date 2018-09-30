"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Crypto = require("./Crypto");

var _Crypto2 = _interopRequireDefault(_Crypto);

var _bip = require("bip39");

var _bip2 = _interopRequireDefault(_bip);

var _randombytes = require("randombytes");

var _randombytes2 = _interopRequireDefault(_randombytes);

var _bitcoincashjsLib = require("bitcoincashjs-lib");

var _bitcoincashjsLib2 = _interopRequireDefault(_bitcoincashjsLib);

var _bchaddrjs = require("bchaddrjs");

var _bchaddrjs2 = _interopRequireDefault(_bchaddrjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Buffer = require("safe-buffer").Buffer;

var Mnemonic = function () {
  function Mnemonic() {
    _classCallCheck(this, Mnemonic);
  }

  _createClass(Mnemonic, [{
    key: "generate",
    value: function generate() {
      var bits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 128;
      var wordlist = arguments[1];

      return _bip2.default.generateMnemonic(bits, _randombytes2.default, wordlist);
    }
  }, {
    key: "fromEntropy",
    value: function fromEntropy(bytes, wordlist) {
      return _bip2.default.entropyToMnemonic(bytes, wordlist);
    }
  }, {
    key: "toEntropy",
    value: function toEntropy(mnemonic, wordlist) {
      return Buffer.from(_bip2.default.mnemonicToEntropy(mnemonic, wordlist), "hex");
    }
  }, {
    key: "validate",
    value: function validate(mnemonic, wordlist) {
      // Preprocess the words
      var words = mnemonic.split(" ");
      // Detect blank phrase
      if (words.length === 0) return "Blank mnemonic";

      // Check each word
      for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (wordlist.indexOf(word) == -1) {
          // Finding closest match to word
          var nearestWord = this.findNearestWord(word, wordlist);
          return word + " is not in wordlist, did you mean " + nearestWord + "?";
        }
      }
      // Check the words are valid
      var properPhrase = words.join();
      var isValid = _bip2.default.validateMnemonic(mnemonic, wordlist);
      if (!isValid) return "Invalid mnemonic";

      return "Valid mnemonic";
    }
  }, {
    key: "toSeed",
    value: function toSeed(mnemonic) {
      var password = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";

      return _bip2.default.mnemonicToSeed(mnemonic, password);
    }
  }, {
    key: "wordLists",
    value: function wordLists() {
      return _bip2.default.wordlists;
    }
  }, {
    key: "toKeypairs",
    value: function toKeypairs(mnemonic) {
      var numberOfKeypairs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

      var rootSeedBuffer = this.toSeed(mnemonic, "");
      var hdNode = _bitcoincashjsLib2.default.HDNode.fromSeedBuffer(rootSeedBuffer);
      var HDPath = "44'/145'/0'/0/";

      var accounts = [];

      for (var i = 0; i < numberOfKeypairs; i++) {
        var childHDNode = hdNode.derivePath("" + HDPath + i);
        accounts.push({
          privateKeyWIF: childHDNode.keyPair.toWIF(),
          address: _bchaddrjs2.default.toCashAddress(childHDNode.getAddress())
        });
      }
      return accounts;
    }
  }, {
    key: "findNearestWord",
    value: function findNearestWord(word, wordlist) {
      var minDistance = 99;
      var closestWord = wordlist[0];
      for (var i = 0; i < wordlist.length; i++) {
        var comparedTo = wordlist[i];
        if (comparedTo.indexOf(word) == 0) return comparedTo;

        var distance = Levenshtein.get(word, comparedTo);
        if (distance < minDistance) {
          closestWord = comparedTo;
          minDistance = distance;
        }
      }
      return closestWord;
    }
  }]);

  return Mnemonic;
}();

exports.default = Mnemonic;

// The following code is from: https://raw.githubusercontent.com/iancoleman/bip39/7ff86d4c983f1e8c80b87b31acfd69fcf98c1b82/src/js/levenshtein.js

/**
 * Extend an Object with another Object's properties.
 *
 * The source objects are specified as additional arguments.
 *
 * @param dst Object the object to extend.
 *
 * @return Object the final object.
 */

var _extend = function _extend(dst) {
  var sources = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < sources.length; ++i) {
    var src = sources[i];
    for (var p in src) {
      if (src.hasOwnProperty(p)) dst[p] = src[p];
    }
  }
  return dst;
};

/**
 * Defer execution of given function.
 * @param  {Function} func
 */
var _defer = function _defer(func) {
  if (typeof setImmediate === "function") return setImmediate(func);

  return setTimeout(func, 0);
};

/**
 * Based on the algorithm at http://en.wikipedia.org/wiki/Levenshtein_distance.
 */
var Levenshtein = {
  /**
   * Calculate levenshtein distance of the two strings.
   *
   * @param str1 String the first string.
   * @param str2 String the second string.
   * @return Integer the levenshtein distance (0 and above).
   */
  get: function get(str1, str2) {
    // base cases
    if (str1 === str2) return 0;
    if (str1.length === 0) return str2.length;
    if (str2.length === 0) return str1.length;

    // two rows
    var prevRow = new Array(str2.length + 1),
        curCol = void 0,
        nextCol = void 0,
        i = void 0,
        j = void 0,
        tmp = void 0;

    // initialise previous row
    for (i = 0; i < prevRow.length; ++i) {
      prevRow[i] = i;
    } // calculate current row distance from previous row
    for (i = 0; i < str1.length; ++i) {
      nextCol = i + 1;

      for (j = 0; j < str2.length; ++j) {
        curCol = nextCol;

        // substution
        nextCol = prevRow[j] + (str1.charAt(i) === str2.charAt(j) ? 0 : 1);
        // insertion
        tmp = curCol + 1;
        if (nextCol > tmp) nextCol = tmp;

        // deletion
        tmp = prevRow[j + 1] + 1;
        if (nextCol > tmp) nextCol = tmp;

        // copy current col value into previous (in preparation for next iteration)
        prevRow[j] = curCol;
      }

      // copy last col value into previous (in preparation for next iteration)
      prevRow[j] = nextCol;
    }

    return nextCol;
  },

  /**
   * Asynchronously calculate levenshtein distance of the two strings.
   *
   * @param str1 String the first string.
   * @param str2 String the second string.
   * @param cb Function callback function with signature: function(Error err, int distance)
   * @param [options] Object additional options.
   * @param [options.progress] Function progress callback with signature: function(percentComplete)
   */
  getAsync: function getAsync(str1, str2, cb, options) {
    options = _extend({}, {
      progress: null
    }, options);

    // base cases
    if (str1 === str2) return cb(null, 0);
    if (str1.length === 0) return cb(null, str2.length);
    if (str2.length === 0) return cb(null, str1.length);

    // two rows
    var prevRow = new Array(str2.length + 1),
        curCol = void 0,
        nextCol = void 0,
        i = void 0,
        j = void 0,
        tmp = void 0,
        startTime = void 0,
        currentTime = void 0;

    // initialise previous row
    for (i = 0; i < prevRow.length; ++i) {
      prevRow[i] = i;
    }nextCol = 1;
    i = 0;
    j = -1;

    var __calculate = function __calculate() {
      // reset timer
      startTime = new Date().valueOf();
      currentTime = startTime;

      // keep going until one second has elapsed
      while (currentTime - startTime < 1000) {
        // reached end of current row?
        if (str2.length <= ++j) {
          // copy current into previous (in preparation for next iteration)
          prevRow[j] = nextCol;

          // if already done all chars
          if (str1.length <= ++i) return cb(null, nextCol);

          // else if we have more left to do

          nextCol = i + 1;
          j = 0;
        }

        // calculation
        curCol = nextCol;

        // substution
        nextCol = prevRow[j] + (str1.charAt(i) === str2.charAt(j) ? 0 : 1);
        // insertion
        tmp = curCol + 1;
        if (nextCol > tmp) nextCol = tmp;

        // deletion
        tmp = prevRow[j + 1] + 1;
        if (nextCol > tmp) nextCol = tmp;

        // copy current into previous (in preparation for next iteration)
        prevRow[j] = curCol;

        // get current time
        currentTime = new Date().valueOf();
      }

      // send a progress update?
      if (null !== options.progress) {
        try {
          options.progress.call(null, i * 100.0 / str1.length);
        } catch (err) {
          return cb("Progress callback: " + err.toString());
        }
      }

      // next iteration
      _defer(__calculate);
    };

    __calculate();
  }
};