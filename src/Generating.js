import axios from "axios"
class Generating {
  constructor(restURL) {
    this.restURL = restURL
  }

  async generateToAddress(blocks, address, maxtries = 1000000) {
    try {
      const response = await axios.post(
        `${
          this.restURL
        }generating/generateToAddress/${blocks}/${address}?maxtries=${maxtries}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
}

export default Generating
