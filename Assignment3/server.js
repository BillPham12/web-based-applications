/*

To test:
Open two browsers at http://localhost:3000/canvasWithTimer.html

//collaboration with Socket IO
//=============================

When the blue cube is moved with the arrow keys, a POST message will be
sent to the server when the arrow key is released, also while the key is
held down.

Clients also request the position of the movingBox by polling the server.
The smoothness is thus affected by the rate at which the polling timer
runs. The trade off is smooth behaviour vs. network traffic.

This polling app is a great candidate to use web sockets instead of polling.

Only the client moving the box will drop waypoints, the other clients don't
see the local waypoints, just their own.
*/

//Cntl+C to stop server
const app = require('http').createServer(handler)
const io = require('socket.io')(app) //wrap server app in socket io capability
const fs = require("fs") //need to read static files
const url = require("url") //to parse url strings
const PORT = process.env.PORT || 3000

app.listen(PORT) //start server listening on PORT


let counter = 1000; //to count invocations of function(req,res)


const ROOT_DIR = "html"; //dir to serve static files from

const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  json: "application/json",
  png: "image/png",
  txt: "text/plain"
}

function get_mime(filename) {
  var ext, type;
  for (let ext in MIME_TYPES) {
    type = MIME_TYPES[ext]
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return type
    }
  }
  return MIME_TYPES["txt"]
}

var clients = 0; // number of clients

io.on('connection', function(socket){
  clients++;
  var data = {clients : clients,
  };
  //update clients numbers to the client
  socket.emit('serverSays',data);
    //socket to control the first player
    socket.on('MovingPlayer', function(data){
      var receivedData = JSON.parse(data);
      //to broadcast message to everyone including sender
      io.emit('MovingPlayer', data);
    });
    //socket to control the second player
    socket.on('MovingPlayer2', function(data){
      var receivedData = JSON.parse(data);
      //to broadcast message to everyone including sender
      io.emit('MovingPlayer2', data);
    });
    //socket to activate moving ball animation
    socket.on('MovingBall', function(data){
      var receivedData = JSON.parse(data);
      //to broadcast message to everyone including sender
      io.emit('MovingBall', data);
    });
    //socket on clients disconnect
    socket.on("disconnect",function(data){
      clients--;
      data = {clients : clients,
      }
      //reduce the number of clients 
      socket.emit('serverSays',data);
    });

  });

function handler(request, response) {
    var urlObj = url.parse(request.url, true, false);
    console.log("\n============================");
    console.log("PATHNAME: " + urlObj.pathname);
    console.log("REQUEST: " + ROOT_DIR + urlObj.pathname);
    console.log("METHOD: " + request.method);

    var receivedData = "";

    //attached event handlers to collect the message data
    request.on("data", function(chunk) {
      receivedData += chunk;
    });

    //event handler for the end of the message
    request.on("end", function() {
      console.log("REQUEST END: ");
      console.log("received data: ", receivedData);
      console.log("type: ", typeof receivedData);

      if (request.method == "POST") {

      }
      if (request.method == "GET") {
        //handle GET requests as static file requests
        fs.readFile(ROOT_DIR + urlObj.pathname, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err))
            //respond with not found 404 to client
            response.writeHead(404)
            response.end(JSON.stringify(err))
            return
          }
          response.writeHead(200, {
            "Content-Type": get_mime(urlObj.pathname)
          })
          response.end(data)
        })
      }
    })
  }

console.log("Server Running at PORT 3000 CNTL-C to quit");
