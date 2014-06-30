var express = require('express')
var socketio = require("socket.io")
var requirejs = require("requirejs")
var Buffer = require('buffer').Buffer

app = express.createServer()
app.listen(process.env.PORT || 3000)

app.configure(function(){
    app.use(express.methodOverride())
    app.use(express.bodyParser())
    app.use(app.router)
    app.use(express.static(__dirname + '/public'))
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})

//var io = socketio.listen(app, { 'log level': 1 })
var io = socketio.listen(app)

io.sockets.on('connection', function(client) {
  client.emit('init', "hello")

  client.on('init', function(message) {
    console.log("server init", message);
  })

  client.on('modify', function(message) {
    if (unlock_timeout != null ) clearTimeout(unlock_timeout)
    unlock_timeout = setTimeout(function() {
      io.sockets.emit('unlock')
      unlock_timeout = null
    }, 5000)
    client.broadcast.emit('lock')

    client.broadcast.emit('modify', c_program)

  })
})





