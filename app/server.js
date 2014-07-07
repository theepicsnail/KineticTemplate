define(["connection!"], function(conn) {
  // conn.local, conn.remote, conn.exports
  var server_time = 0;
  conn.exports.check_date = function(time) {
    console.log("Server time updated:", time, "vs", server_time);
    if (server_time === 0) {
      server_time = time;
    }

    if(time > server_time) {
      location.reload();
    }
  };

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
