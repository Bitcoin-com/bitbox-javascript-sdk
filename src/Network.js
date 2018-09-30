import axios from "axios"
class Network {
  constructor(restURL) {
    this.restURL = restURL
  }

  async addNode(node, command) {
    try {
      const response = await axios.post(
        `${this.restURL}network/addNode/${node}/${command}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async clearBanned() {
    try {
      const response = await axios.post(`${this.restURL}clearBanned`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async disconnectNode(configuration) {
    try {
      const response = await axios.post(
        `${this.restURL}disconnectNode/${configuration}`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getAddedNodeInfo(node) {
    let path = `${this.restURL}network/getAddedNodeInfo`
    if (node) path = `${path}?node=${node}`

    try {
      const response = await axios.get(path)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getConnectionCount() {
    try {
      const response = await axios.get(
        `${this.restURL}network/getConnectionCount`
      )
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getNetTotals() {
    try {
      const response = await axios.get(`${this.restURL}network/getNetTotals`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getNetworkInfo() {
    try {
      const response = await axios.get(`${this.restURL}network/getNetworkInfo`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }

  async getPeerInfo() {
    try {
      const response = await axios.get(`${this.restURL}network/getPeerInfo`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
  //
  // listBanned() {
  //   // List all banned IPs/Subnets.
  //   return axios.get(`${this.restURL}network/listBanned`)
  //   .then((response) => {
  //     return response.data;
  //   })
  //   .catch((error) => {
  //     return JSON.stringify(error.response.data.error.message);
  //   });
  // }

  async ping() {
    try {
      const response = await axios.get(`${this.restURL}network/ping`)
      return response.data
    } catch (error) {
      throw error.response.data
    }
  }
  //
  // setBan(subnet, command, bantime, absolute) {
  //   // Attempts add or remove a IP/Subnet from the banned list.
  //   //
  //   // Arguments:
  //   // 1. "subnet"       (string, required) The IP/Subnet (see getpeerinfo for nodes ip) with a optional netmask (default is /32 = single ip)
  //   // 2. "command"      (string, required) 'add' to add a IP/Subnet to the list, 'remove' to remove a IP/Subnet from the list
  //   // 3. "bantime"      (numeric, optional) time in seconds how long (or until when if [absolute] is set) the ip is banned (0 or empty means using the default time of 24h which can also be overwritten by the -bantime startup argument)
  //   // 4. "absolute"     (boolean, optional) If set, the bantime must be a absolute timestamp in seconds since epoch (Jan 1 1970 GMT)
  //
  //   return axios.post(`${this.baseurl}network/setban/${subnet}/${command}`)
  //   .then((response) => {
  //     return response.data;
  //   })
  //   .catch((error) => {
  //     return JSON.stringify(error.response.data.error.message);
  //   });
  // }
  //
  // setNetworkActive(state) {
  //   // Disable/enable all p2p network activity.
  //   //
  //   // Arguments:
  //   // 1. "state"        (boolean, required) true to enable networking, false to disable
  //
  //   return axios.post(`${this.baseurl}network/setNetworkActive/${state}`)
  //   .then((response) => {
  //     return response.data;
  //   })
  //   .catch((error) => {
  //     return JSON.stringify(error.response.data.error.message);
  //   });
  // }
}

export default Network
