define(["connection!"], function(conn) {
  // conn.local, conn.remote, conn.exports

  conn.exports.init = function(a, boxes) {
    console.log("init", a, boxes);
  };

  conn.exports.update = function(box_id, box) {
    console.log("update", box_id, box);
  };

  function API() {
  }
  console.log(conn);
  API.prototype.grab = conn.remote.grab;
  API.prototype.release = conn.remote.release;

  return new API();
});
