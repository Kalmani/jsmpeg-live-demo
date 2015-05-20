var nw = !!global.window;
var express = require('express');
var app = express();
var gui;

if(nw) {
  gui = global.window.nwDispatcher.requireNwGui();
  gui.App.clearCache();
}

var Interface = new Class({
  Implements : [Options, Events],
  Binds      : [],

  options : {
    title   : 'test',
    focus   : true,
    icon    : '',
    toolbar : true,
    height : 768,
    width : 1021,
    resizable : false
  },

  initialize : function(streamer){
    this.streamer = streamer;
    var self = this;
    self.create_window();
  },

  create_window: function(callback){
    var self = this;
    self.stream_cam();
  },

  prepare_tools : function(iframe) {
    // close events
    setInterval(function(){
      if(iframe.y === undefined)
        gui.App.quit();
    }, 200);
    iframe.on('close', gui.App.quit);
  },

  stream_cam : function() {
    var self = this;
    console.log('start');
    server = new this.streamer({'camera_name' : this.streamer.devices.video[0]});
    server.startServer(function(){


      var iframe = gui.Window.open('http://localhost:6201', self.options);

      iframe.once('loaded', function(){
        var doc = iframe.window.document;
        self.prepare_tools(iframe);
        server.startStreamer();
        var canvas = doc.getElementById('videoCanvas');
        // Show loading notice
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#444';
        ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);

        var player;

        self.http_server = require('http').createServer(app);
        var io = require('socket.io')(self.http_server);
        var socket = io.connect();

        socket.once("connect", function(){
          console.log("Connected");

          socket.once("VS_INIT", function(data, ack) {
            console.log("VS_INIT DATA", data);
            ack(true);
            player = new jsmpeg(data.width, data.height, {canvas:canvas});
            socket.on("VS", function(data){
              player.feed(data);
            });
          });
        });

      });











    });
  }
});




module.exports = Interface;
