require.config({
  baseUrl: "app",
  paths: {
    "kinetic": "/bower_components/kineticjs/kinetic",
  }
});

require(["stage", "state", "player"],function(stage, state, Player) {
  //server.create_box = function(boxid, box) {
  //    stage.addBox(box);
  //};
  //server.init();

  var role = "player1";
  var paddle = Player.P1;
  state.grab(role)
  .catch(function() {
    role = "player2";
    paddle = Player.P2;
    return state.grab(role);
  })
  .catch(function() {
    role = "observer";
    paddle = null;
  })
  .then(function(){
    console.log("role:", role);
    if(paddle) setupPaddle(paddle, role);
  });

  state.on('player1', Player.P1.getUpdateFunc());
  state.on('player2', Player.P2.getUpdateFunc());
  stage.fg.add(Player.P1);
  stage.fg.add(Player.P2);
  Player.P1.draw();
  Player.P2.draw();
  function setupPaddle(paddle, player) {
    document.addEventListener('touchstart', function(e){e.preventDefault();}, false);
    document.addEventListener('touchmove', function(e) {
      var next = {y:e.touches[0].clientY};
      state.set(player, next);
    }, false);
  }
});
