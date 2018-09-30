"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Network = function () {
  function Network(restURL) {
    _classCallCheck(this, Network);

    this.restURL = restURL;
  }

  _createClass(Network, [{
    key: "addNode",
    value: async function addNode(node, command) {
      try {
        var response = await _axios2.default.post(this.restURL + "network/addNode/" + node + "/" + command);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "clearBanned",
    value: async function clearBanned() {
      try {
        var response = await _axios2.default.post(this.restURL + "clearBanned");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "disconnectNode",
    value: async function disconnectNode(configuration) {
      try {
        var response = await _axios2.default.post(this.restURL + "disconnectNode/" + configuration);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getAddedNodeInfo",
    value: async function getAddedNodeInfo(node) {
      var path = this.restURL + "network/getAddedNodeInfo";
      if (node) path = path + "?node=" + node;

      try {
        var response = await _axios2.default.get(path);
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getConnectionCount",
    value: async function getConnectionCount() {
      try {
        var response = await _axios2.default.get(this.restURL + "network/getConnectionCount");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getNetTotals",
    value: async function getNetTotals() {
      try {
        var response = await _axios2.default.get(this.restURL + "network/getNetTotals");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getNetworkInfo",
    value: async function getNetworkInfo() {
      try {
        var response = await _axios2.default.get(this.restURL + "network/getNetworkInfo");
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    }
  }, {
    key: "getPeerInfo",
    value: async function getPeerInfo() {
      try {
        var response = await _axios2.default.get(this.restURL + "network/getPeerInfo");
        return response.data;
      } catch (error) {
        throw error.response.data;
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

  }, {
    key: "ping",
    value: async function ping() {
      try {
        var response = await _axios2.default.get(this.restURL + "network/ping");
        return response.data;
      } catch (error) {
        throw error.response.data;
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

  }]);

  return Network;
}();

exports.default = Network;