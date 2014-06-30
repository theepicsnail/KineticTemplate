define([], function() {

  function setup_server(server) {
    server.on('connection', function(c) {
      console.log("Connection", c);
    });
  }

  return {
    setup:setup_server
  };
});
