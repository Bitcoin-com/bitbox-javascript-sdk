import axios from "axios"
class Mining {
  constructor(restURL) {
    this.restURL = restURL
  }

  async getBlockTemplate(template_request) {
    try {
      const response = await axios.get(
        `${this.restURL}mining/getBlockTemplate/${template_request}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getMiningInfo() {
    try {
      const response = await axios.get(`${this.restURL}mining/getMiningInfo`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getNetworkHashps(nblocks = 120, height = 1) {
    try {
      const response = await axios.get(
        `${
          this.restURL
        }mining/getNetworkHashps?nblocks=${nblocks}&height=${height}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async submitBlock(hex, parameters) {
    let path = `${this.restURL}mining/submitBlock/${hex}`
    if (parameters) path = `${path}?parameters=${parameters}`

    try {
      const response = await axios.post(path)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
}

export default Mining
