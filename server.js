var global = {};

global.boxes = [
  {x:10, y:10, w:10, h:10, c:'#FF0000'},
  {x:15, y:15, w:10, h:10, c:'#0000FF'},
];

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
    allow:['init']
  });
  eureca.onConnect(function(conn) {
    var client = eureca.getClient(conn.id);
    client.init(conn.id);
  });

  eureca.attach(server);
  server.listen(2000, '0.0.0.0');
  console.log("http://theepicsnail.net:2000");
}

start_server();
