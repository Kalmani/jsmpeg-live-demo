var util    = require('util');
var cp      = require("child_process");
var express = require('express');
var app     = express();

var path    = require('path');
var appDir  = path.dirname(require.main.filename);



var Streamer = new Class({
  Implements : [Options],
  Binds      : [
    'attachViewer',
    'startStreamer',
    'startServer'
  ],

  options : {
    http_port   :  6201,
    http_addr   :  '0.0.0.0',
    camera_name : null, //first camera available will be picked
    width       : 320,
    height      : 240,
  },

  clients      : [],
  http_server  : null,

  initialize : function(options){
    var self = this;
    this.setOptions(options);

    this.http_server = require('http').createServer(app);
    var io = require('socket.io')(this.http_server);

    io.on('connection', this.attachViewer);
    app.use(express.static(appDir   + '/public'));
  },

  attachViewer : function(socket) {
    var self = this;
    var streamHeader = {
      width  : Number(self.options.width),
      height : Number(self.options.height),
    }
    socket.emit("VS_INIT", streamHeader, function(){
      self.clients.push(socket);
      console.log("New streamer client (%d total)", self.clients.length);
    });

    socket.once('close', function(code, message){
      self.clients.erase(socket);
      console.log( 'Disconnected client (%d total)', self.clients.length );
    });
  },

  startServer : function(chain){
    this.http_server.listen(this.options.http_port,
        this.options.http_addr, chain);
  },

  startStreamer : function() {
    console.log("Startserver");

    var self = this;
    var cmd = [
      "ffmpeg",
      "-y",
      "-s", util.format("%dx%d", self.options.width, self.options.height), 
      "-f", "dshow",
      "-i", util.format('video=%s', self.options.camera_name),
      "-f", "mpeg1video",
      "-b", "800k", 
      "-r", "20",
      "-",
    ];

    var foo = cp.spawn(cmd.shift(), cmd);
    foo.stderr.on("data", function(data){
      //console.log(data.toString());
    });

    foo.stdout.on("data", function(data) {
      if(Math.floor(Math.random()*100) < 0) {
        console.log("Skipping frame");
      } else {
        Array.each(self.clients, function(socket){
          socket.emit("VS", data);
        });
      }
    });

  },

    //this will never "fail"
  listDevices : function(chain){

    var cmd   = "ffmpeg -list_devices true -f dshow -i dummy";
    var hmask = new RegExp("DirectShow (video|audio) devices"),
        imask = new RegExp('"(.*?)\\s*"\\s+$');

    var blocks = {"video": [], "audio": []}, hsection;
    cp.exec(cmd, function(err, stdout, stderr){
      var lines = stderr.split("\n");
      for(var line, i=0;i<lines.length; i++){
        line = lines[i];
        if(hsection)
            if(imask.test(line))
              blocks[hsection].push(imask.exec(line)[1]);
            else hsection = null;
        if(hmask.test(line))
            hsection = hmask.exec(line)[1];
      }
      chain(blocks);
    });

  }.static(),
});




module.exports = Streamer;
