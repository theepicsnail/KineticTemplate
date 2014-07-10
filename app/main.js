require.config({
  baseUrl: "app",
  paths: {
    "kinetic": "/bower_components/kineticjs/kinetic",
  }
});

require(["stage", "game_server"],function(stage, server) {
  server.create_box = function(boxid, box) {
      stage.addBox(box);
  };
  server.init();
});
