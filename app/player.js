define(["kinetic"], function(Kinetic){
  var Dir = Object.freeze({
    LEFT: 0, RIGHT:1
  });

  function Player(dir) {
    this.config = {
      x: (dir===Dir.LEFT)? 0 : 480,
      y: 0
    };
    this.className = this.constructor.name;
    Kinetic.Group.call(this, this.config);

    this.add(new Kinetic.Rect({
      x:0, y:0,
      width: 20,
      height: 100,
      fill: 'blue'
    }));
  }

  Player.prototype = {
  };

  Kinetic.Util.extend(Player, Kinetic.Group);
  Kinetic.Collection.mapMethods(Player);

  return {
    P1: new Player(Dir.LEFT),
    P2: new Player(Dir.RIGHT)
  };
});
