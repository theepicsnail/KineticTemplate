var global = {};
global.clients = [];
global.state = {
  0: {owner:null, val:{x:100, y:100, w:100, h:100, c:'#FF0000'}},
  1: {owner:null, val:{x:150, y:150, w:100, h:100, c:'#0000FF'}},
};


// Client functions:
global.clientFunctions = [
  'check_date', //(timestamp)
  'init', //(conn.id, boxes)
  'update'//(box id, box)
];

function broadcast_update(key) {
  console.log("broadcast_udate");
  for(cid = 0 ; cid < global.clients.length ; cid++) {
    console.log("  " + global.clients[cid] + ":" + key +", ", global.state[key]);
    global.clients[cid].update(key, global.state[key]);
  }
}

function set(key, value) {
  console.log("update", key, value, this.connection.id, global.state);
  if (global.state[key] === undefined) {
    global.state[key] = {owner:null, val:value};
    broadcast_update(key);
    return true;
  }
  if (global.state[key].owner === null ||
      global.state[key].owner === this.connection.id) {
    global.state[key].val = value;
    broadcast_update(key);
    return true;
  }
  return false;
}

function grab(key) {
  console.log("grab", key, this.connection.id);
  if (global.state[key] === undefined) {
    global.state[key] = {owner:null, val:null}; // Grabbing non-exiting values creates them with null
  }

  if (global.state[key].owner === null) {
    global.state[key].owner = this.connection.id;
    broadcast_update(key);
    return true;
  }

  return global.state[key].owner === this.connection.id;
}

function init() {
  console.log("init", this.connection.id);
  this.connection.client.init(this.connection.id, global.state);
}

function release(id) {
  console.log("release", key, this.connection.id);
  var box = global.state[key];
  var cid = this.connection.id;
  if (box !== undefined && box.owner === cid)
  {
    box.owner = null;
    broadcast_update(key);
    return true;
  }
  return false;
}

// Actually bring up the server and all that nonsense
function start_server() {
  var start_time = new Date() | 0;

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
    console.log("Connect:", conn.id);
    client.check_date(start_time);
    global.clients.push(client);
  });

  eureca.exports = {
    grab: grab,
    release: release,
    set: set,
    init: init
  };

  eureca.attach(server);
  server.listen(2000, '0.0.0.0');
  console.log("http://theepicsnail.net:2000");
}

start_server();
