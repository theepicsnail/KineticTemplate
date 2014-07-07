var global = {};
global.clients = [];
global.boxes = {
  0: {x:10, y:10, w:10, h:10, c:'#FF0000', owner:undefined},
  1: {x:15, y:15, w:10, h:10, c:'#0000FF', owner:undefined},
};


// Client functions:
global.clientFunctions = [
  'init', //(conn.id)
  'update'//(box id, box)
];

function broadcast_update(id) {
  for(cid = 0 ; cid < global.clients.length ; cid++) {
    global.clients[cid].update(id, global.boxes[id]);
  }
}

function update(id, box) {
  console.log("update", id, box, this.connection.id);
  var cid;
  if (global.boxes[id].owner === this.connection.id) {
    global.boxes[id] = box;
    broadcast_update(id);
  }
}

function grab(id) {
  console.log("grab", id, this.connection.id);
  if (global.boxes[id].owner === undefined) {
    global.boxes[id].owner = this.connection.id;
    broadcast_update(id);
  }
  return global.boxes[id].owner === this.connection.id;
}

function release(id) {
  console.log("release", id, this.connection.id);
  var box = global.boxes[id];
  var cid = this.connection.id;
  if (box !== undefined && box.owner === cid)
  {
    box.owner = undefined;
    broadcast_update(id);
  }
  return global.boxes[id].owner === this.connection.id;
}

// Actually bring up the server and all that nonsense
function start_server() {
  var express = require('express');
  var app = express(app);
  var server = require('http').createServer(app);

  app.use(express.static(__dirname));
  app.get('/', function (req, res, next) {
    res.sendfile('index.html');
  });

  //Eureca sockjs rpc
  var EurecaServer = new require('eureca.io').EurecaServer;
  var eureca = new EurecaServer({
    //Client functions
    allow: global.clientFunctions
  });
  eureca.onConnect(function(conn) {
    var client = eureca.getClient(conn.id);
    client.init(conn.id, global.boxes);
    global.clients.push(client);
  });

  eureca.exports = {
    grab: grab,
    release: release,
    update: update
  };

  eureca.attach(server);
  server.listen(2000, '0.0.0.0');
  console.log("http://theepicsnail.net:2000");
}

start_server();
