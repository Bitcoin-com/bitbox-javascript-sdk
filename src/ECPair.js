import Bitcoin from "bitcoincashjs-lib"
import bchaddr from "bchaddrjs"
import coininfo from "coininfo"

class ECPair {
  static fromWIF(privateKeyWIF) {
    let network
    if (privateKeyWIF[0] === "L" || privateKeyWIF[0] === "K")
      network = "bitcoincash"
    else if (privateKeyWIF[0] === "c") network = "testnet"

    let bitcoincash
    if (network === "bitcoincash") bitcoincash = coininfo.bitcoincash.main
    else bitcoincash = coininfo.bitcoincash.test

    const bitcoincashBitcoinJSLib = bitcoincash.toBitcoinJS()

    return Bitcoin.ECPair.fromWIF(privateKeyWIF, bitcoincashBitcoinJSLib)
  }

  static toWIF(ecpair) {
    return ecpair.toWIF()
  }

  static sign(ecpair, buffer) {
    return ecpair.sign(buffer)
  }

  static verify(ecpair, buffer, signature) {
    return ecpair.verify(buffer, signature)
  }

  static fromPublicKey(pubkeyBuffer) {
    return Bitcoin.ECPair.fromPublicKeyBuffer(pubkeyBuffer)
  }

  static toPublicKey(ecpair) {
    return ecpair.getPublicKeyBuffer()
  }

  static toLegacyAddress(ecpair) {
    return ecpair.getAddress()
  }

  static toCashAddress(ecpair) {
    return bchaddr.toCashAddress(ecpair.getAddress())
  }
}

export default ECPair
