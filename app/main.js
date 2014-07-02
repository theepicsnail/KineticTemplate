require.config({
  baseUrl: "app",
  paths: {
    "kinetic": "/bower_components/kineticjs/kinetic",
    "sockjs": "/bower_components/sockjs/sockjs"
  }
});

require(["kinetic", "server"],function(K, s) {
  console.log(s);
});
