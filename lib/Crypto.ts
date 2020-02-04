import randomBytes from "./Randombytes"
const Bitcoin = require("@bitcoin-dot-com/bitcoincashjs2-lib")

export class Crypto {
  public sha1(buffer: Buffer): Buffer {
    return Bitcoin.crypto.sha1(buffer)
  }

  public sha256(buffer: Buffer): Buffer {
    return Bitcoin.crypto.sha256(buffer)
  }

  public ripemd160(buffer: Buffer): Buffer {
    return Bitcoin.crypto.ripemd160(buffer)
  }

  public hash256(buffer: Buffer): Buffer {
    return Bitcoin.crypto.hash256(buffer)
  }

  public hash160(buffer: Buffer): Buffer {
    return Bitcoin.crypto.hash160(buffer)
  }

  public randomBytes(size: number = 16): Buffer {
    return randomBytes(size)
  }
}
