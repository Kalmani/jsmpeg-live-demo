require('nyks');
var Streamer = require('./lib/streamer.js');

//see streamer.js for available options
var args     = process.parseargs().dict;



var server;

Streamer.listDevices(function(devices){
   console.info("Available video devices", devices.video);
  if(!devices.video.length)
    throw "Cannot find any video device";
  if(!args.camera_name) {
      args.camera_name = devices.video[0]
      console.info("Using default camera ",args.camera_name);
   } else if(!devices.video.contains(args.camera_name))
      throw ("Invalid camera name " + args.camera_name);


  server = new Streamer(args);
  server.startServer(function(){
    server.startStreamer();
  });

});

