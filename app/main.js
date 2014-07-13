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

  var role = "player1";
  state.grab(role)
  .catch(function() {
    role = "player2";
    return state.grab(role);
  })
  .catch(function() {
    role = "observer";
  })
  .then(function(){
    console.log("role:", role);
  });

});
