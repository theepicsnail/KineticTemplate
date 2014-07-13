define(["server"], function(server) {
  /*
  * grab(key) -> bool: lock acquired
  * release(key) -> bool: lock was held
  *   (either way, you don't have a lock now.)
  *
  * set(key, value)
  * get(key)
  * on(key, callback)
  */

  function State(server) {
    this.server = server;
    this.local_data = {};
    this.callbacks = {};
    server.on.update = this._change.bind(this);
    server.on.init = this._init.bind(this);
    server.init();
  }

  State.prototype = {
    grab: function(key) {
      return new Promise((function(ret, thr){
        this.server.grab(key).onReady(ret);
      }).bind(this));
    },
    release: function(key) {
      return new Promise((function(ret, thr) {
        this.server.release(key).onReady(ret);
      }).bind(this));
    },
    set: function(key, value) {
      return new Promise((function(ret, thr) {
        console.log("Calling server.set", key, value);
        this.server.set(key, value).onReady(ret);
      }).bind(this));
    },
    get: function(key) {
      return this.local_data[key];
    },
    on: function(key, callback) {
      this.callbacks[key] = (this.callbacks[key] || []).concat([callback]);
    },

    //Server callbacks
    _change: function(key, value) {
      this.local_data[key] = value;
      if (this.callbacks[key]) {
        this.callbacks[key].forEach(function(cb) {
          setTimeout(function(){
            cb(value);
          }, 0);
        });
      }
    },
    _init: function(id, data) {
      this.local_data = data;
    }

   //  return new Promise(function(ret, thr) {
   //     this.server.get(key).onReady(ret);
   //   });
   // },
  };

  return new State(server);
});
