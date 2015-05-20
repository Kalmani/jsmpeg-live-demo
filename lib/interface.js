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

  initialize : function(){
    var self = this;
    self.create_window();
  },

  create_window: function(callback){
    var self = this;
        iframe = gui.Window.open('http://localhost:6201', self.options);

    iframe.once('loaded', function(){
      var doc = iframe.window.document;
      self.prepare_tools(iframe);
      self.stream_cam(iframe);
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
  }
});




module.exports = Interface;
