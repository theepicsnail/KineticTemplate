
function new_connection(conn) {
  console.log("new connection");
  conn.Emit = function(name, obj) {
    console.log("emitting",name,obj);
    conn.write(JSON.stringify({
      key: name,
      val: obj
    }));
  };

  conn.on('data', function(message) {
    message = JSON.parse(message);
    console.log("received message:", message);
    if(message.key === "echo") {
      conn.Emit('echo', message.val);
    }else {
      console.warn("Missing callback for", message.key, message.val);
    }
  });
  conn.on('close', function() {
    console.log("Closed");
  });
  conn.Emit('init', {id:conn.id});
}

// Actually bring up the server and all that nonsense
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
