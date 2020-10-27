// imports
import axios, { AxiosResponse } from "axios"
import {
  AddressDetailsResult,
  AddressUnconfirmedResult,
  AddressUtxoResult
} from "bitcoin-com-rest"
import * as bcl from "bitcoincashjs-lib"
import { BchInfo } from ".."
import { REST_URL } from "./BITBOX"

// consts
// TODO: port require statements to impprt
const Bitcoin = require("@bitcoin-dot-com/bitcoincashjs2-lib")
const cashaddr = require("cashaddrjs")
const coininfo = require("coininfo")

interface Hash {
  hash: Buffer
}

interface Bytes extends Hash {
  version: number
}

interface Decoded extends Hash {
  prefix: string
  type: string
  format: string
}

interface DecodedHash160 {
  legacyAddress: string
  cashAddress: string
  format: string
}

export class Address {
  public restURL: string
  constructor(restURL: string = REST_URL) {
    this.restURL = restURL
  }

  // Translate address from any address format into a specific format.
  public toLegacyAddress(address: string): string {
    const { prefix, type, hash }: Decoded = this._decode(address)
    let bitcoincash: BchInfo = coininfo.bitcoincash.main
    switch (prefix) {
      case "bitcoincash":
        bitcoincash = coininfo.bitcoincash.main
        break
      case "bchtest":
        bitcoincash = coininfo.bitcoincash.test
        break
      case "bchreg":
        bitcoincash = coininfo.bitcoincash.regtest
        break
    }

    let version: number = bitcoincash.versions.public
    switch (type) {
      case "P2PKH":
        version = bitcoincash.versions.public
        break
      case "P2SH":
        version = bitcoincash.versions.scripthash
        break
    }

    const hashBuf: Buffer = Buffer.from(hash)

    return Bitcoin.address.toBase58Check(hashBuf, version)
  }

  public toCashAddress(
    address: string,
    prefix: boolean = true,
    regtest: boolean = false
  ): string {
    const decoded: Decoded = this._decode(address)

    let prefixString: string
    if (regtest) prefixString = "bchreg"
    else prefixString = decoded.prefix

    const cashAddress: string = cashaddr.encode(
      prefixString,
      decoded.type,
      decoded.hash
    )

    if (prefix) return cashAddress
    return cashAddress.split(":")[1]
  }

  // Converts legacy address format to hash160
  public legacyToHash160(address: string): string {
    const bytes: Bytes = Bitcoin.address.fromBase58Check(address)
    return bytes.hash.toString("hex")
  }

  // Converts cash address format to hash160
  public cashToHash160(address: string): string {
    const legacyAddress: string = this.toLegacyAddress(address)
    const bytes: Bytes = Bitcoin.address.fromBase58Check(legacyAddress)
    return bytes.hash.toString("hex")
  }

  // Converts regtest address format to hash160
  // regtestToHash160(address: string): string {
  //   const legacyAddress = this.toLegacyAddress(address)
  //   const bytes = Bitcoin.address.fromBase58Check(legacyAddress)
  //   return bytes.hash.toString("hex")
  // }

  // Converts hash160 to Legacy Address
  public hash160ToLegacy(
    hash160: string,
    network: number = Bitcoin.networks.bitcoin.pubKeyHash
  ): string {
    const buffer: Buffer = Buffer.from(hash160, "hex")
    return Bitcoin.address.toBase58Check(buffer, network)
  }

  // Converts hash160 to Cash Address
  public hash160ToCash(
    hash160: string,
    network: number = Bitcoin.networks.bitcoin.pubKeyHash,
    regtest: boolean = false
  ): string {
    const legacyAddress: string = this.hash160ToLegacy(hash160, network)
    return this.toCashAddress(legacyAddress, true, regtest)
  }

  public isLegacyAddress(address: string): boolean {
    return this.detectAddressFormat(address) === "legacy"
  }

  public isCashAddress(address: string): boolean {
    return this.detectAddressFormat(address) === "cashaddr"
  }

  public isHash160(address: string): boolean {
    return this._detectHash160Format(address) === "hash160"
  }

  // Test for address network.
  public isMainnetAddress(address: string): boolean {
    if (address[0] === "x") return true
    else if (address[0] === "t") return false

    return this.detectAddressNetwork(address) === "mainnet"
  }

  public isTestnetAddress(address: string): boolean {
    if (address[0] === "x") return false
    else if (address[0] === "t") return true

    return this.detectAddressNetwork(address) === "testnet"
  }

  public isRegTestAddress(address: string): boolean {
    return this.detectAddressNetwork(address) === "regtest"
  }

  // Test for address type.
  public isP2PKHAddress(address: string): boolean {
    return this.detectAddressType(address) === "p2pkh"
  }

  public isP2SHAddress(address: string): boolean {
    return this.detectAddressType(address) === "p2sh"
  }

  public detectAddressFormat(address: string): string {
    const decoded: Decoded = this._decode(address)
    return decoded.format
  }

  public detectAddressNetwork(address: string): string {
    if (address[0] === "x") return "mainnet"
    else if (address[0] === "t") return "testnet"

    const decoded: Decoded = this._decode(address)
    let prefix: string = ""

    switch (decoded.prefix) {
      case "bitcoincash":
        prefix = "mainnet"
        break
      case "bchtest":
        prefix = "testnet"
        break
      case "bchreg":
        prefix = "regtest"
        break
    }

    return prefix
  }

  public detectAddressType(address: string): string {
    const decoded: Decoded = this._decode(address)
    return decoded.type.toLowerCase()
  }

  public fromXPub(xpub: string, path: string = "0/0"): string {
    let bitcoincash: BchInfo
    if (xpub[0] === "x") bitcoincash = coininfo.bitcoincash.main
    else bitcoincash = coininfo.bitcoincash.test

    const bitcoincashBitcoinJSLib: any = bitcoincash.toBitcoinJS()
    const HDNode: bcl.HDNode = Bitcoin.HDNode.fromBase58(
      xpub,
      bitcoincashBitcoinJSLib
    )
    const address: bcl.HDNode = HDNode.derivePath(path)
    return this.toCashAddress(address.getAddress())
  }

  public fromXPriv(xpriv: string, path: string = "0'/0"): string {
    let bitcoincash: BchInfo
    if (xpriv[0] === "x") bitcoincash = coininfo.bitcoincash.main
    else bitcoincash = coininfo.bitcoincash.test

    const bitcoincashBitcoinJSLib: any = bitcoincash.toBitcoinJS()
    const HDNode: bcl.HDNode = Bitcoin.HDNode.fromBase58(
      xpriv,
      bitcoincashBitcoinJSLib
    )
    const address: bcl.HDNode = HDNode.derivePath(path)
    return this.toCashAddress(address.getAddress())
  }

  public fromOutputScript(
    scriptPubKey: Buffer,
    network: string = "mainnet"
  ): string {
    let netParam: any
    let isRegtest: boolean
    switch (network) {
      case 'mainnet':
        netParam = Bitcoin.networks.bitcoin
        isRegtest = false
        break
      case 'testnet':
        netParam = Bitcoin.networks.testnet
        isRegtest = false
        break
      case 'regtest':
        netParam = Bitcoin.networks.testnet
        isRegtest = true
        break
      default:
        netParam = Bitcoin.networks.bitcoin
        isRegtest = false
    }

    return this.toCashAddress(
      Bitcoin.address.fromOutputScript(scriptPubKey, netParam),
      true,
      isRegtest
    )
  }

  public async details(
    address: string | string[]
  ): Promise<AddressDetailsResult | AddressDetailsResult[]> {
    try {

      // Handle single address.
      if (typeof address === "string") {
        const response: AxiosResponse = await axios.get(
          `${this.restURL}address/details/${address}`
        )

        return <AddressDetailsResult>response.data

        // Handle array of addresses.
      } else if (Array.isArray(address)) {

        // Dev note: must use axios.post for unit test stubbing.
        const response: AxiosResponse = await axios.post(
          `${this.restURL}address/details`,
          {
            addresses: address
          }
        )

        return <AddressDetailsResult>response.data
      }

      throw new Error(`Input address must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }

  public async utxo(
    address: string | string[]
  ): Promise<AddressUtxoResult | AddressUtxoResult[]> {
    try {
      // Handle single address.
      if (typeof address === "string") {
        const response: AxiosResponse = await axios.get(
          `${this.restURL}address/utxo/${address}`
        )
        return response.data
      } else if (Array.isArray(address)) {

        // Dev note: must use axios.post for unit test stubbing.
        const response: AxiosResponse = await axios.post(
          `${this.restURL}address/utxo`,
          {
            addresses: address
          }
        )

        return response.data
      }

      throw new Error(`Input address must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }

  public async unconfirmed(
    address: string | string[]
  ): Promise<AddressUnconfirmedResult | AddressUnconfirmedResult[]> {
    try {
      // Handle single address.
      if (typeof address === "string") {
        const response: AxiosResponse = await axios.get(
          `${this.restURL}address/unconfirmed/${address}`
        )
        return response.data

        // Handle an array of addresses
      } else if (Array.isArray(address)) {

        // Dev note: must use axios.post for unit test stubbing.
        const response: AxiosResponse = await axios.post(
          `${this.restURL}address/unconfirmed`,
          {
            addresses: address
          }
        )

        return response.data
      }

      throw new Error(`Input address must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }

  public async transactions(address: string | string[]): Promise<any> {
    try {
      // Handle single address.
      if (typeof address === "string") {
        const response: AxiosResponse = await axios.get(
          `${this.restURL}address/transactions/${address}`
        )
        return response.data

        // Handle an array of addresses
      } else if (Array.isArray(address)) {

        // Dev note: must use axios.post for unit test stubbing.
        const response: AxiosResponse = await axios.post(
          `${this.restURL}address/transactions`,
          {
            addresses: address
          }
        )

        return response.data
      }

      throw new Error(`Input address must be a string or array of strings.`)
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }

  private _detectHash160Format(address: string): string {
    const decoded: DecodedHash160 = this._decodeHash160(address)
    return decoded.format
  }

  private _decode(address: string): Decoded {
    try {
      return this._decodeLegacyAddress(address)
    } catch (error) {}

    try {
      return this._decodeCashAddress(address)
    } catch (error) {}

    throw new Error(`Unsupported address format : ${address}`)
  }

  private _decodeHash160(address: string): DecodedHash160 {
    try {
      return this._decodeAddressFromHash160(address)
    } catch (error) {}

    throw new Error(`Unsupported address format : ${address}`)
  }

  private _decodeLegacyAddress(address: string): Decoded {
    const { version, hash }: Bytes = Bitcoin.address.fromBase58Check(address)
    const info: {
      main: any
      test: any
    } = coininfo.bitcoincash

    let decoded: Decoded = {
      prefix: "",
      type: "",
      hash: hash,
      format: ""
    }
    switch (version) {
      case info.main.versions.public:
        decoded = {
          prefix: "bitcoincash",
          type: "P2PKH",
          hash: hash,
          format: "legacy"
        }
        break
      case info.main.versions.scripthash:
        decoded = {
          prefix: "bitcoincash",
          type: "P2SH",
          hash: hash,
          format: "legacy"
        }
        break
      case info.test.versions.public:
        decoded = {
          prefix: "bchtest",
          type: "P2PKH",
          hash: hash,
          format: "legacy"
        }
        break
      case info.test.versions.scripthash:
        decoded = {
          prefix: "bchtest",
          type: "P2SH",
          hash: hash,
          format: "legacy"
        }
        break
    }
    return decoded
  }

  private _decodeCashAddress(address: string): Decoded {
    if (address.indexOf(":") !== -1) {
      const decoded: Decoded = cashaddr.decode(address)
      decoded.format = "cashaddr"
      return decoded
    }

    const prefixes: string[] = ["bitcoincash", "bchtest", "bchreg"]
    for (let i: number = 0; i < prefixes.length; ++i) {
      try {
        const decoded: Decoded = cashaddr.decode(`${prefixes[i]}:${address}`)
        decoded.format = "cashaddr"
        return decoded
      } catch (error) {}
    }

    throw new Error(`Invalid format : ${address}`)
  }

  private _decodeAddressFromHash160(address: string): DecodedHash160 {
    let decodedHash160: DecodedHash160 = {
      legacyAddress: "",
      cashAddress: "",
      format: ""
    }
    if (address.length === 40) {
      decodedHash160 = {
        legacyAddress: this.hash160ToLegacy(address),
        cashAddress: this.hash160ToCash(address),
        format: "hash160"
      }
    } else if (this.isCashAddress(address) || this.isLegacyAddress(address)) {
      decodedHash160 = {
        legacyAddress: this.toLegacyAddress(address),
        cashAddress: this.toCashAddress(address),
        format: "nonHash160"
      }
    }
    return decodedHash160
  }
}
