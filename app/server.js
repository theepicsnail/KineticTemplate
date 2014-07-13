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

  conn.exports.init = function(){
    api.on.init.apply(this, arguments);
  };
  conn.exports.update = function(){
    api.on.update.apply(this, arguments);
  };

  var api = {
    init: conn.remote.init,
    set: conn.remote.set,
    grab: conn.remote.grab,
    release: conn.remote.release,
    on: {
      init: function(){console.log("init", arguments);},
      update: function(){console.log("update", arguments);},
    }
  };
  console.log("returnning server");
  return api;
});
