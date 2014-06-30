requirejs.config({
  baseUrl: 'js',
  map: {
    '*': {
      'promise': 'libs/es6-promise/promise',
      'socket.io': '/socket.io/socket.io.js',
    }
  },
  shim: {
    'libs/es6-promise/promise':{
      exports: 'Promise'
    },
    '/socket.io/socket.io.js':{
      exports: 'io'
    }
  }
});

require(["client", "loadscreen", "app/resources", "app/main"],
function( client,   loadscreen,       resources,       main) {

  loadscreen.start();
  resources.load().then(main.init).then(function() {
    loadscreen.stop();
    main.start();
  });
});

