require('nyks');
var Streamer = require('./lib/streamer.js'),
    Interface = require('./lib/interface.js'),
    //see streamer.js for available options
    args     = process.parseargs().dict,
    server;

//interface = new Interface();

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