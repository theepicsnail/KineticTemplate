define([], function() {
  var DIR = {NONE:-1, CENTER:0, UP:1, DOWN:2, LEFT:3, RIGHT:4};
  var FILL_TIME = 0.35; //half a second to fill

  function Cell(color) {
    this.color = color;
    this.fill_start_time = 0;
    this.fill_color = 1;
    this.fill_dir = -1; //Math.floor(Math.random()*5);
    this.fill_percent = 0;
    this.up = undefined;
    this.down = undefined;
    this.left = undefined;
    this.right = undefined;
  }

  Cell.prototype.draw = function(ctx, x,y,size) {
    x -= 1;
    y -= 1;
    size -= 2;
    // Fill cell
    ctx.fillStyle = Cell.colors[this.color];
    ctx.fillRect(x, y, size, size);
//    console.log(x,y);
    // If we're filling this cell
    if (this.fill_percent !== 0 && this.fill_dir !== DIR.NONE) {
      ctx.fillStyle = Cell.colors[this.fill_color];
      var part = size * this.fill_percent; // 0 to size
      switch(this.fill_dir) {
        case DIR.UP: ctx.fillRect(x, y+size-part, size, part); break;
        case DIR.DOWN: ctx.fillRect(x, y, size, part); break;
        case DIR.LEFT: ctx.fillRect(x+size-part, y, part, size); break;
        case DIR.RIGHT: ctx.fillRect(x, y, part, size); break;
        case DIR.CENTER: ctx.fillRect(x + (size-part)/2, y + (size-part)/2, part, part); break;
      }
    }
  };

  Cell.prototype.onFill = function (){
    // set the fill start time here.
    var self = this;
    function possiblyFill(node, dir) {
      if (node && node.fill_dir === DIR.NONE && node.color === self.color) {
        node.startFill(self.fill_color, dir, Math.max(.05, self.fill_time * .9));
      }
    }

    possiblyFill(this.up, Cell.DIR.UP);
    possiblyFill(this.left, Cell.DIR.LEFT);
    possiblyFill(this.down, Cell.DIR.DOWN);
    possiblyFill(this.right, Cell.DIR.RIGHT);
  };

  Cell.prototype.setTimestamp = function(timestamp) {
    if (this.fill_dir === DIR.NONE) {
      return;
    }
    var dt = timestamp - this.fill_start_time;
    // console.log(dt > 1, this.fill_dir);
    if( dt > this.fill_time) {
      this.onFill();
      this.fill_dir = DIR.NONE;
      this.color = this.fill_color;
    }
    this.fill_percent = (timestamp - this.fill_start_time) % this.fill_time * (1/this.fill_time);
  };

  Cell.prototype.startFill = function(color, dir, time, start_time) {
    if (color === this.color) {
      return;
    }
    if (time === undefined) {
      time = FILL_TIME;
    }
    if (start_time === undefined) {
      start_time = +new Date()/1000;
    }
    this.fill_time = time;
    this.fill_start_time = start_time;
    this.fill_color = color;
    this.fill_dir = dir;

  };


  function generateColors() {
    console.log("A");
    // Pick 4 random kind of palleted colors
    // This is done by picking a random angle in the hue spectrum
    // and a delta angle (between each colors hue
    var colors = [];
    var offset = Math.random(); // 0 to 1
    var delta = 2.4 * (Math.random() > .5? 1:-1);//Math.random()*0.8 + 0.1;

    var delta_sat = .618;
    var offset_sat = Math.random();

   var i;
    for(i = 0 ; i < 4 ; i ++) {
      var angle = offset + delta * i;
      angle = Math.floor(angle * 360) % 360;
      var sat = Math.floor((delta_sat * i + offset_sat) % 1 * 60 + 20); //20% - 80%
      console.log(sat);
      colors.push("hsl(" + angle + "," + sat + "%,50%)");
    }
    console.log(colors);
    return colors;
  };

  Cell.colors = generateColors();
  Cell.DIR = DIR;

  return Cell;
});
