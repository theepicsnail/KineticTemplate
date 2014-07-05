/*
  This is the client side of the bridge between the client and the server.
  Its name is 'server' because from the clients perspective, this is
  doing stuff to/on/in response to the server
*/
define([], function(){
  var client = new Eureca.Client();
  console.log(client);
  client.ready(function(proxy){
    console.log("ready");
  });
  client.exports.init = function(id){
    console.log('init', id);
  };

  return client;
});
