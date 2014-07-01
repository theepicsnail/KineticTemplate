


function new_connection(conn) {
  conn.on('data', function(message) {
    console.log("Received:", message);
    conn.write(message); // send it back.
  });
  conn.on('close', function() {});
}


function start_server() {
  var http = require('http');
  var http_server = http.createServer();

  //Static content
  var node_static = require('node-static');
  var static_dir = new node_static.Server(__dirname);
  http_server.addListener('request', function(req, res) {
    console.log(__dirname + req.url);
    static_dir.serve(req,res);
  });

  //Sockjs
  var sockjs = require('sockjs');
  var sock_server = sockjs.createServer();
  sock_server.on('connection', new_connection);
  sock_server.installHandlers(http_server, {prefix:'/sjs'});

  http_server.listen(2000, '0.0.0.0');
  console.log("http://theepicsnail.net:2000");
}

start_server();
