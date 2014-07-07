define({
  load: function (name, req, onload, config) {
    var client = new Eureca.Client();
    client.ready(function(proxy){
      onload({
        remote: proxy,
        local: client,
        exports: client.exports
      });
    });
  }
});
