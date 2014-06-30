define(["socket.io"], function(socket) {
  var sock = socket.connect();
  sock.on('init', function(message) {
    console.log("client init", message);
    sock.emit('init', "world")
  });

  return {

  };
});
