jsmpeg-live-demo
==========

#### Motivation ####

A demo usage of the [jmpeg](https://github.com/131/jsmpeg) javascript MPEG1 Decoder using websockets.


### Installation ###

```
npm install
bower install

node .
```
then browse through http://127.0.0.1:6201/

### Settings ###

```
Available options
    http_port   :  6201,
    http_addr   :  '0.0.0.0',
    camera_name : 'Integrated Webcam',
    width       : '320',
    height      : '240',

Options are to be passes as CLI arguments e.g.
node server.js --camera_name="My HD5000"

```