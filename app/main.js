require.config({
  baseUrl: "app",
  paths: {
    "kinetic": "/bower_components/kineticjs/kinetic",
    "sockjs": "/bower_components/sockjs/sockjs"
  }
});
require(["kinetic", "sockjs"],function(K, S) {
  sock = new SockJS('http://' + document.domain + ':' + location.port + '/sjs');
  sock.onopen = function() {
    console.log('connected');
    sock.send(JSON.stringify({"hello":"world"}));
  };
  sock.onmessage = function(msg) {
    console.log('sock>', msg);
  };
});
