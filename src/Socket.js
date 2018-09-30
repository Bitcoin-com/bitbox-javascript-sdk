import io from "socket.io-client"

class Socket {
  constructor(config = {}) {
    if (typeof config === "string") {
      // TODO remove this check in v2.0
      this.socket = io(`${config}`)
    } else {
      if (config.restURL) {
        this.socket = io(`${config.restURL}`)
      } else {
        const restURL = "https://rest.bitcoin.com"
        this.socket = io(`${restURL}`)
      }

      if (config.callback) config.callback()
    }
  }

  listen(endpoint, cb) {
    this.socket.emit(endpoint)

    if (endpoint === "blocks") this.socket.on("blocks", msg => cb(msg))
    else if (endpoint === "transactions")
      this.socket.on("transactions", msg => cb(msg))
  }
}

export default Socket
