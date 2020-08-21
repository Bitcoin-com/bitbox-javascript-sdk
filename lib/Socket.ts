import { BITSOCKET_URL, WS_URL } from "./BITBOX"
import { SocketConfig } from "./interfaces/BITBOXInterfaces"
import io from "socket.io-client"
import EventSource from "eventsource"

enum SocketType {
  Uninitialized,
  SocketIO,
  BitSocket
}

export class Socket {
  socket: any
  websocketURL: string
  bitsocketURL: string
  socketType: SocketType = SocketType.Uninitialized

  constructor(config: SocketConfig = {}) {  
    // Order of preference: passed in wsURL, deprecated restURL, fallback WS_URL
    this.websocketURL = config.wsURL || config.restURL || WS_URL
    // Similar for BitSocket case
    this.bitsocketURL = config.bitsocketURL || BITSOCKET_URL
    // Execute callback (immediate, synchronous and unconditional)
    if (config.callback) config.callback()
    // Note that we can't set socketType in constructor as config may contain 
    // both socket.io and BitSocket URLs, so we need to wait for listen() before
    // we know which type it will be.
  }

  public listen(query: string, cb: Function): void {
    if (query === "blocks" || query === "transactions") {
      // socket.io case
      switch (this.socketType) {
        case SocketType.Uninitialized:
          this.socketType = SocketType.SocketIO
          this.socket = io(this.websocketURL, { transports: ["websocket"] })
        case SocketType.SocketIO:
          // Send server the event name of interest. At time of writing this is
          // not used by the server but is left in so that server-side filtering
          // is an option in the future.
          this.socket.emit(query) 
          this.socket.on(query, (msg: any) => cb(msg))
          break;
        case SocketType.BitSocket:
          throw new Error("Query type not possible on a BitSocket connection.")
      }
    } else { 
      // BitSocket case
      switch (this.socketType) {
        case SocketType.Uninitialized:
          this.socketType = SocketType.BitSocket
          let b64 = Buffer.from(JSON.stringify(query)).toString("base64")
          this.socket = new EventSource(`${this.bitsocketURL}/s/${b64}`)
          this.socket.onmessage = (msg: any) => {
            cb(msg.data)
          }
          break;
        case SocketType.BitSocket:
          throw new Error("Only one BitSocket query can be run at a time.")
        case SocketType.SocketIO:
          throw new Error("Query type not possible on a SocketIO connection.")
      }
    }
  }

  public close(cb?: Function): void {
    this.socket.close()
    if (cb) cb()
  }
}
