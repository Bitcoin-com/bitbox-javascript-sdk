import axios from "axios"
import bchaddr from "bchaddrjs"
import Bitcoin from "bitcoincashjs-lib"

class Address {
  constructor(restURL) {
    this.restURL = restURL
  }

  // Translate address from any address format into a specific format.
  toLegacyAddress(address) {
    return bchaddr.toLegacyAddress(address)
  }

  toCashAddress(address, prefix = true) {
    if (prefix) return bchaddr.toCashAddress(address)

    return bchaddr.toCashAddress(address).split(":")[1]
  }

  // Converts any address format to hash160
  toHash160(address) {
    const legacyAddress = bchaddr.toLegacyAddress(address)
    const bytes = Bitcoin.address.fromBase58Check(legacyAddress)
    return bytes.hash.toString("hex")
  }

  // Converts hash160 to Legacy Address
  hash160ToLegacy(hash160, network = Bitcoin.networks.bitcoin.pubKeyHash) {
    const buffer = Buffer(hash160, "hex")
    const legacyAddress = Bitcoin.address.toBase58Check(buffer, network)
    return legacyAddress
  }

  // Converts hash160 to Cash Address
  hash160ToCash(hash160, network = Bitcoin.networks.bitcoin.pubKeyHash) {
    const legacyAddress = this.hash160ToLegacy(hash160, network)
    return this.toCashAddress(legacyAddress)
  }

  // Test for address format.
  isLegacyAddress(address) {
    return bchaddr.isLegacyAddress(address)
  }

  isCashAddress(address) {
    return bchaddr.isCashAddress(address)
  }

  // Test for address network.
  isMainnetAddress(address) {
    if (address[0] === "x") return true
    else if (address[0] === "t") return false

    return bchaddr.isMainnetAddress(address)
  }

  isTestnetAddress(address) {
    if (address[0] === "x") return false
    else if (address[0] === "t") return true

    return bchaddr.isTestnetAddress(address)
  }

  // Test for address type.
  isP2PKHAddress(address) {
    return bchaddr.isP2PKHAddress(address)
  }

  isP2SHAddress(address) {
    return bchaddr.isP2SHAddress(address)
  }

  // Detect address format.
  detectAddressFormat(address) {
    return bchaddr.detectAddressFormat(address)
  }

  // Detect address network.
  detectAddressNetwork(address) {
    if (address[0] === "x") return "mainnet"
    else if (address[0] === "t") return "testnet"

    return bchaddr.detectAddressNetwork(address)
  }

  // Detect address type.
  detectAddressType(address) {
    return bchaddr.detectAddressType(address)
  }

  fromXPub(xpub, path = "0/0") {
    const HDNode = Bitcoin.HDNode.fromBase58(
      xpub,
      Bitcoin.networks[this.detectAddressNetwork(xpub)]
    )
    const address = HDNode.derivePath(path)
    return this.toCashAddress(address.getAddress())
  }

  fromOutputScript(scriptPubKey, network = "bitcoincash") {
    let netParam
    if (network !== "bitcoincash") netParam = Bitcoin.networks.testnet

    return bchaddr.toCashAddress(
      Bitcoin.address.fromOutputScript(scriptPubKey, netParam)
    )
  }

  async details(address) {
    if (typeof address !== "string") address = JSON.stringify(address)

    try {
      const response = await axios.get(
        `${this.restURL}address/details/${address}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async utxo(address) {
    if (typeof address !== "string") address = JSON.stringify(address)

    try {
      const response = await axios.get(`${this.restURL}address/utxo/${address}`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async unconfirmed(address) {
    if (typeof address !== "string") address = JSON.stringify(address)

    try {
      const response = await axios.get(
        `${this.restURL}address/unconfirmed/${address}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
}

export default Address
