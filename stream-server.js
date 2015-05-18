require('nyks');

var util    = require('util');
var cp      = require("child_process");
var express = require('express');
var app     = express();


var server = require('http').createServer(app);
var io = require('socket.io')(server);


var HTTP_PORT   = 6201;
var CAMERA_NAME = 'Integrated Webcam';
var width  = 320,
    height = 240;


var clients = [];

io.on('connection', function(socket){

  var streamHeader = {
    width  : width,
    height : height,
  }
  socket.emit("VS_INIT", streamHeader, function(){
    clients.push(socket);
    console.log("New streamer client (%d total)", clients.length);
  });

  socket.on('close', function(code, message){
    clients.erase(socket);
    console.log( 'Disconnected client (%d total)', clients.length );
  });
});



var args = [
  "-y",
  "-s", util.format("%dx%d", width, height), 
  "-f", "dshow",
  "-i", util.format('video=%s', CAMERA_NAME),
  "-f", "mpeg1video",
  "-b", "800k", 
  "-r", "20",
  "-",
];

var foo = cp.spawn("ffmpeg", args);
foo.stderr.on("data", function(data){
  console.log(data.toString());
});

foo.stdout.on("data", function(data) {
  if(Math.floor(Math.random()*100) < 0) {
    console.log("Skipping frame");
  } else {
    Array.each(clients, function(socket){
      socket.emit("VS", data);
    });
  }
});


app.use(express.static(__dirname + '/public'));
server.listen(HTTP_PORT, "0.0.0.0");
