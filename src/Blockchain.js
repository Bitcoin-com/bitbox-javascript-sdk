import axios from "axios"
class Blockchain {
  constructor(restURL) {
    this.restURL = restURL
  }

  async getBestBlockHash() {
    try {
      const response = await axios.get(
        `${this.restURL}blockchain/getBestBlockHash`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getBlock(blockhash, verbose = true) {
    try {
      const response = await axios.get(
        `${this.restURL}blockchain/getBlock/${blockhash}?verbose=${verbose}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getBlockchainInfo() {
    try {
      const response = await axios.get(
        `${this.restURL}blockchain/getBlockchainInfo`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getBlockCount() {
    try {
      const response = await axios.get(
        `${this.restURL}blockchain/getBlockCount`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getBlockHash(height = 1) {
    if (typeof height !== "string") height = JSON.stringify(height)

    try {
      const response = await axios.get(
        `${this.restURL}blockchain/getBlockHash/${height}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getBlockHeader(hash, verbose = true) {
    if (typeof hash !== "string") hash = JSON.stringify(hash)

    try {
      const response = await axios.get(
        `${this.restURL}blockchain/getBlockHeader/${hash}?verbose=${verbose}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getChainTips() {
    try {
      const response = await axios.get(`${this.restURL}blockchain/getChainTips`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getDifficulty() {
    try {
      const response = await axios.get(
        `${this.restURL}blockchain/getDifficulty`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getMempoolAncestors(txid, verbose = false) {
    if (typeof txid !== "string") txid = JSON.stringify(txid)

    try {
      const response = await axios.get(
        `${
          this.restURL
        }blockchain/getMempoolAncestors/${txid}?verbose=${verbose}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getMempoolDescendants(txid, verbose = false) {
    if (typeof txid !== "string") txid = JSON.stringify(txid)

    try {
      const response = await axios.get(
        `${
          this.restURL
        }blockchain/getMempoolDescendants/${txid}?verbose=${verbose}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getMempoolEntry(txid) {
    if (typeof txid !== "string") txid = JSON.stringify(txid)

    try {
      const response = await axios.get(
        `${this.restURL}blockchain/getMempoolEntry/${txid}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getMempoolInfo() {
    try {
      const response = await axios.get(
        `${this.restURL}blockchain/getMempoolInfo`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getRawMempool(verbose = false) {
    try {
      const response = await axios.get(
        `${this.restURL}blockchain/getRawMempool?vebose=${verbose}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getTxOut(txid, n, include_mempool = true) {
    try {
      const response = await axios.get(
        `${
          this.restURL
        }blockchain/getTxOut/${txid}/n?include_mempool=${include_mempool}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getTxOutProof(txids, blockhash) {
    let path = `${this.restURL}blockchain/getTxOutProof/${txids}`
    if (blockhash) path = `${path}?blockhash=${blockhash}`

    try {
      const response = await axios.get(path)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async preciousBlock(blockhash) {
    try {
      const response = await axios.get(
        `${this.restURL}blockchain/preciousBlock/${blockhash}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async pruneBlockchain(height) {
    try {
      const response = await axios.post(
        `${this.restURL}blockchain/pruneBlockchain/${height}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async verifyChain(checklevel = 3, nblocks = 6) {
    try {
      const response = await axios.get(
        `${
          this.restURL
        }blockchain/verifyChain?checklevel=${checklevel}&nblocks=${nblocks}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async verifyTxOutProof(proof) {
    try {
      const response = await axios.get(
        `${this.restURL}blockchain/verifyTxOutProof/proof`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
}

export default Blockchain
