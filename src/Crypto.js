import randomBytes from "randombytes"
import Bitcoin from "bitcoincashjs-lib"

class Crypto {
  static sha256(buffer) {
    return Bitcoin.crypto.sha256(buffer)
  }

  static ripemd160(buffer) {
    return Bitcoin.crypto.ripemd160(buffer)
  }

  static hash256(buffer) {
    return Bitcoin.crypto.hash256(buffer)
  }

  static hash160(buffer) {
    return Bitcoin.crypto.hash160(buffer)
  }

  static randomBytes(size = 16) {
    return randomBytes(size)
  }
}

export default Crypto
