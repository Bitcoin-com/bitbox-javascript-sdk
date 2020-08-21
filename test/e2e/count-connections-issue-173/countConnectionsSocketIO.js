const BITBOX = require("../../../lib/BITBOX").BITBOX;
const { exec } = require('child_process');

const bitbox = new BITBOX();
const socket = new bitbox.Socket();

function countSockets(stage) {
  return new Promise((resolve, reject) => {
    // Call the lsof system command for outgoing internet connections.
    exec(`lsof -i -n -P | grep ${process.pid}`, (err, stdout, stderr) => { 
      // Print list of open connections allowing a visual count to be done.
      console.log(`Outbound connections from this node process ${stage}:\n${stdout}`);
      resolve();
    });
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {

  await countSockets("before calling listen");

  // First call to listen() which should create new connection.
  socket.listen("transactions", (message) => {
    console.log("Received a transaction.");
  });
  
  // Second call to listen() which should share connection with first call.
  // Use try catch in case this throws one of our new errors.
  try {
    socket.listen("blocks", (message) => {
      console.log("Received a block.");
    });
  } catch(error) {
    console.log(`ERROR: ${error.message}`);
  }

  // listen doesn't return a promise so wait 100ms for connections to establish.
  await sleep(100);
  
  await countSockets("after calling listen twice");

  // now close the socket 
  socket.close();

  // callback from close() is short-circuited so give it 100ms to clean up.
  await sleep(100);

    // check if any zombie connections remaining
  await countSockets("after calling close (zombie connections)");

  // exit process
  process.exit();

})().catch((error)=> {console.log(`ERROR: ${error.message}`)});


