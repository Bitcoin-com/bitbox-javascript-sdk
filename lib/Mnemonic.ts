import * as BIP39 from "bip39"
import * as bcl from "bitcoincashjs-lib"
// import * as Bitcoin from "bitcoincashjs-lib"
import { Buffer } from "buffer"
import randomBytes from "randombytes"
import * as wif from "wif"
import { Address } from "./Address"
// TODO: convert "bitcoincashjs-lib" require to import
const Bitcoin = require("bitcoincashjs-lib")

export class Mnemonic {
  private _address: Address
  constructor(address: Address = new Address()) {
    this._address = address
  }

  public generate(
    bits: number = 128,
    wordlist: string[] = this.wordLists().english
  ): string {
    return BIP39.generateMnemonic(bits, randomBytes, wordlist)
  }

  public fromEntropy(
    bytes: Buffer,
    wordlist: string[] = this.wordLists().english
  ): string {
    return BIP39.entropyToMnemonic(bytes, wordlist)
  }

  public toEntropy(
    mnemonic: string,
    wordlist: string[] = this.wordLists().english
  ): Buffer {
    return Buffer.from(BIP39.mnemonicToEntropy(mnemonic, wordlist), "hex")
  }

  public validate(
    mnemonic: string,
    wordlist: string[] = this.wordLists().english
  ): string {
    // Preprocess the words
    const words = mnemonic.split(" ")
    // Detect blank phrase
    if (words.length === 0) return "Blank mnemonic"

    // Check each word
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      if (wordlist.indexOf(word) == -1) {
        // Finding closest match to word
        const nearestWord = this.findNearestWord(word, wordlist)
        return `${word} is not in wordlist, did you mean ${nearestWord}?`
      }
    }
    // Check the words are valid
    const isValid = BIP39.validateMnemonic(mnemonic, wordlist)
    if (!isValid) return "Invalid mnemonic"

    return "Valid mnemonic"
  }

  public toSeed(mnemonic: string, password: string = ""): Buffer {
    return BIP39.mnemonicToSeed(mnemonic, password)
  }

  public wordLists(): any {
    return BIP39.wordlists
  }

  public toKeypairs(
    mnemonic: string,
    numberOfKeypairs: number = 1,
    regtest: boolean = false
  ): any {
    const rootSeedBuffer: Buffer = this.toSeed(mnemonic, "")
    const hdNode: bcl.HDNode = Bitcoin.HDNode.fromSeedBuffer(rootSeedBuffer)
    const HDPath: string = `44'/145'/0'/0/`

    const accounts: any[] = []

    for (let i = 0; i < numberOfKeypairs; i++) {
      const childHDNode: bcl.HDNode = hdNode.derivePath(`${HDPath}${i}`)

      let prefix: number = 128
      if (regtest === true) prefix = 239

      accounts.push({
        privateKeyWIF: wif.encode(
          prefix,
          childHDNode.keyPair.d.toBuffer(32),
          true
        ),
        address: this._address.toCashAddress(
          childHDNode.getAddress(),
          true,
          regtest
        )
      })
    }
    return accounts
  }

  public findNearestWord(word: string, wordlist: string[]): string {
    let minDistance: number = 99
    let closestWord: string = wordlist[0]
    for (let i: number = 0; i < wordlist.length; i++) {
      const comparedTo: string = wordlist[i]
      if (comparedTo.indexOf(word) == 0) return comparedTo

      const distance: number = Levenshtein.get(word, comparedTo)
      if (distance < minDistance) {
        closestWord = comparedTo
        minDistance = distance
      }
    }
    return closestWord
  }
}

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

const _extend: any = function(dst: any): any {
  const sources: any = Array.prototype.slice.call(arguments, 1)
  for (let i: number = 0; i < sources.length; ++i) {
    const src = sources[i]
    for (const p in src) if (src.hasOwnProperty(p)) dst[p] = src[p]
  }
  return dst
}

/**
 * Defer execution of given function.
 * @param  {Function} func
 */
const _defer: any = function(func: any): any {
  if (typeof setImmediate === "function") return setImmediate(func)

  return setTimeout(func, 0)
}

/**
 * Based on the algorithm at http://en.wikipedia.org/wiki/Levenshtein_distance.
 */
var Levenshtein: any = {
  /**
   * Calculate levenshtein distance of the two strings.
   *
   * @param str1 String the first string.
   * @param str2 String the second string.
   * @return Integer the levenshtein distance (0 and above).
   */
  get: function(str1: any, str2: any) {
    // base cases
    if (str1 === str2) return 0
    if (str1.length === 0) return str2.length
    if (str2.length === 0) return str1.length

    // two rows
    let prevRow: any[] = new Array(str2.length + 1),
      curCol,
      nextCol,
      i,
      j,
      tmp

    // initialise previous row
    for (i = 0; i < prevRow.length; ++i) prevRow[i] = i

    // calculate current row distance from previous row
    for (i = 0; i < str1.length; ++i) {
      nextCol = i + 1

      for (j = 0; j < str2.length; ++j) {
        curCol = nextCol

        // substution
        nextCol = prevRow[j] + (str1.charAt(i) === str2.charAt(j) ? 0 : 1)
        // insertion
        tmp = curCol + 1
        if (nextCol > tmp) nextCol = tmp

        // deletion
        tmp = prevRow[j + 1] + 1
        if (nextCol > tmp) nextCol = tmp

        // copy current col value into previous (in preparation for next iteration)
        prevRow[j] = curCol
      }

      // copy last col value into previous (in preparation for next iteration)
      prevRow[j] = nextCol
    }

    return nextCol
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
  getAsync: function(str1: any, str2: any, cb: any, options: any) {
    options = _extend(
      {},
      {
        progress: null
      },
      options
    )

    // base cases
    if (str1 === str2) return cb(null, 0)
    if (str1.length === 0) return cb(null, str2.length)
    if (str2.length === 0) return cb(null, str1.length)

    // two rows
    const prevRow: any[] = new Array(str2.length + 1)
    let curCol: any
    let nextCol: any
    let i: any
    let j: any
    let tmp: any
    let startTime: any
    let currentTime: any

    // initialise previous row
    for (i = 0; i < prevRow.length; ++i) prevRow[i] = i

    nextCol = 1
    i = 0
    j = -1

    var __calculate = function() {
      // reset timer
      startTime = new Date().valueOf()
      currentTime = startTime

      // keep going until one second has elapsed
      while (currentTime - startTime < 1000) {
        // reached end of current row?
        if (str2.length <= ++j) {
          // copy current into previous (in preparation for next iteration)
          prevRow[j] = nextCol

          // if already done all chars
          if (str1.length <= ++i) return cb(null, nextCol)

          // else if we have more left to do

          nextCol = i + 1
          j = 0
        }

        // calculation
        curCol = nextCol

        // substution
        nextCol = prevRow[j] + (str1.charAt(i) === str2.charAt(j) ? 0 : 1)
        // insertion
        tmp = curCol + 1
        if (nextCol > tmp) nextCol = tmp

        // deletion
        tmp = prevRow[j + 1] + 1
        if (nextCol > tmp) nextCol = tmp

        // copy current into previous (in preparation for next iteration)
        prevRow[j] = curCol

        // get current time
        currentTime = new Date().valueOf()
      }

      // send a progress update?
      if (null !== options.progress) {
        try {
          options.progress.call(null, (i * 100.0) / str1.length)
        } catch (err) {
          return cb(`Progress callback: ${err.toString()}`)
        }
      }

      // next iteration
      _defer(__calculate)
    }

    __calculate()
  }
}
