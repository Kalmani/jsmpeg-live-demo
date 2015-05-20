var nw = !!global.window;

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
        iframe = gui.Window.open('http://localhost:6201', self.options);

    iframe.once('loaded', function(){
      var doc = iframe.window.document;
      console.log(doc);
      self.prepare_tools(iframe);
      self.stream_cam(doc);
    });
  },

  prepare_tools : function(iframe) {
    // close events
    setInterval(function(){
      if(iframe.y === undefined)
        gui.App.quit();
    }, 200);
    iframe.on('close', gui.App.quit);
  },

  stream_cam : function(iframe) {
    console.log('start');
    server = new this.streamer({'camera_name' : this.streamer.devices.video[0]});
    server.startServer(function(){
      server.startStreamer();


      // Show loading notice
      var canvas = new Element('canvas', {'id' : 'videoCanvas',  'width' : '640', 'height': '480'}).inject(iframe.window.document);
      console.log(canvas);
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#444';
      ctx.fillText('Loading...', canvas.width/2-30, canvas.height/3);

      var player;
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
  }
});




module.exports = Interface;
