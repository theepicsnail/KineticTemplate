require.config({
  baseUrl: "app",
  paths: {
    "kinetic": "/bower_components/kineticjs/kinetic",
  }
});

require(["stage", "state"],function(stage, state) {
  //server.create_box = function(boxid, box) {
  //    stage.addBox(box);
  //};
  //server.init();
  console.log(state);
});
