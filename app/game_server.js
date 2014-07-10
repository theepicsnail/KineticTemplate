define(["server"], function(server) {
  var boxes = {};
  var id = 0;

  var api = {
    create_box: function(box_id, box) {console.log("gs createbox", box_id);},
    grab_box: function(box_id) {},
    init: server.init
  };

  server.on.init = function(connid, new_boxes) {
    for(var boxid in new_boxes){
      api.create_box(boxid, new_boxes[boxid]);
    }
    boxes = new_boxes;
    id = connid;
  };

  server.on.update = function(id, box) {
    boxes[id] = box;
  };

  return api;
});
