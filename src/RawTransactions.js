import axios from "axios"
class RawTransactions {
  constructor(restURL) {
    this.restURL = restURL
  }

  async decodeRawTransaction(hex) {
    if (typeof hex !== "string") hex = JSON.stringify(hex)

    try {
      const response = await axios.get(
        `${this.restURL}rawtransactions/decodeRawTransaction/${hex}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async decodeScript(script) {
    if (typeof script !== "string") script = JSON.stringify(script)

    try {
      const response = await axios.get(
        `${this.restURL}rawtransactions/decodeScript/${script}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getRawTransaction(txid, verbose = false) {
    if (typeof txid !== "string") txid = JSON.stringify(txid)

    try {
      const response = await axios.get(
        `${
          this.restURL
        }rawtransactions/getRawTransaction/${txid}?verbose=${verbose}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async sendRawTransaction(hex, allowhighfees = false) {
    if (typeof hex !== "string") hex = JSON.stringify(hex)

    try {
      const response = await axios.post(
        `${
          this.restURL
        }rawtransactions/sendRawTransaction/${hex}?allowhighfees=${allowhighfees}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
}

export default RawTransactions
