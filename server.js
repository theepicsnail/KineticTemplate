var exec = require('child_process').spawn;

var cmd = null;
function run(input) {

  if (cmd !== null) {
    cmd.kill();
    set('outputs', {stdout:"Killed", stderr:""});
  }
  set('outputs', {stdout:"", stderr:""});
  cmd = exec('echo', ['>>', input, '<<']);

  cmd.stderr.on('data', function(data) {
    outputs = get('outputs');
    outputs.stderr += data;
    set('outputs', outputs);
  });

  cmd.stdout.on('data', function(data) {
    outputs = get('outputs');
    outputs.stdout += data;
    set('outputs', outputs);
  });

  cmd.on('close', function(code) {
    console.log('close:');
    console.log(code);
    cmd = null;
  });
}


var global = {};
global.clients = [];
global.state = {
  input: {owner:null, val:""},
  outputs: {owner:null, val:{stdout: "", stderr: ""}}
};


// Client functions:
global.clientFunctions = [
  'check_date', //(timestamp)
  'init', //(conn.id, boxes)
  'update'//(key, value)
];

function broadcast_update(key) {
  console.log("broadcast_udate");
  for(cid = 0 ; cid < global.clients.length ; cid++) {
    console.log("  " + global.clients[cid] + ":" + key +", ", global.state[key]);
    global.clients[cid].update(key, global.state[key]);
  }
}
function get(key) {
  return global.state[key].val;
}

function set(key, value) {
  var id = (this.connection && this.connection.id) || "SERVER";
  if(key == "input") run(value);
  console.log("update", key, value, id, global.state);
  if (global.state[key] === undefined) {
    global.state[key] = {owner:null, val:value};
    broadcast_update(key);
    return true;
  }
  if (global.state[key].owner === null ||
      global.state[key].owner === id) {
    global.state[key].val = value;
    broadcast_update(key);
    return true;
  }
  return false;
}

function grab(key, id) {
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

function release(id, cid) {
  cid = cid || this.connection.id;
  console.log("release", key, cid);
  var box = global.state[key];
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
  eureca.onDisconnect(function(conn) {
    for(key in global.state) {
      release(key, conn.id); // try releasing any state this connection's holding
    }
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
