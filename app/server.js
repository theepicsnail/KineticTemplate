/*
  This is the client side of the bridge between the client and the server.
  Its name is 'server' because from the clients perspective, this is
  doing stuff to/on/in response to the server
*/
define(["sockjs"], function(SockJS){

  function Server() {
    this.sock = undefined;
    this.connected = false;
    this.event_map = {};
    this.connect();
  }

  Server.prototype.connect = function() {

    this.sock = new SockJS('http://' + document.domain + ':' + location.port + '/sjs');
    this.emit = (function(name, obj) {
      console.log("sock.send:", name, obj);
      this.sock.send(JSON.stringify({
        key:name, val:obj
      }));
      return this;
    }).bind(this);

    this.when = (function(key, callback) {
      this.event_map[key] = callback;
      console.log(this.event_map);
      return this;
    }).bind(this);

    this.sock.onopen = (function() {
      this.connected = true;
    }).bind(this);

    this.sock.onmessage = (function(msg) {
      var obj = JSON.parse(msg.data);
      console.log("Received:", obj, this.event_map);
      var cb = this.event_map[obj.key];
      if(cb)
        cb(obj.val, this);
      else
        console.warn("Missing callback for", obj.key, obj.val);
    }).bind(this);

  };

  return new Server().when('init', function(obj, connection){
    console.log('init:', obj, this);
    connection.emit('echo', {hello:'world'});
  }).when('echo', function(obj){
    console.log('echo:', obj);
  });
});
