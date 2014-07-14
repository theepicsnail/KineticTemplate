define(["kinetic"], function(Kinetic){
  var stage = new Kinetic.Stage({
    container: 'body',
    width: 500,
    height:500
  });

  var bg = new Kinetic.Layer();
  stage.add(bg);

  var fg = new Kinetic.Layer();
  stage.add(fg);



/*  layer.add(new Kinetic.Rect({
    x:0, y:0,
    width:200, height:200,
    fill:'#ff0000'
  }));

/*  var trashImg = new Image();
  trashImg.onload = function() {
    console.log(this);
    layer.add(new Kinetic.Image({
      x:200, y:100, image:this, width:100, height:100
    }));
    layer.draw();
  };
  trashImg.src = '/res/trash.png';
  */

  return {
    fg:fg
  };
});
