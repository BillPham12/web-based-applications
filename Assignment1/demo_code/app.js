var http = require('http');
var fs = require('fs');
var url = require('url');

var ROOT_DIR = 'html';

var MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript", //should really be application/javascript
  json: "application/json",
  png: "image/png",
  txt: "text/plain"
};

var get_mime = function(filename) {
  var ext, type;
  for (ext in MIME_TYPES) {
    type = MIME_TYPES[ext];
    if (filename.indexOf(ext, filename.length - ext.length) !== -1) {
      return type;
    }
  }
  return MIME_TYPES["txt"];
};

http
  .createServer(function(request, response) {
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
      console.log("received data: ", receivedData);
      console.log("type: ", typeof receivedData);

      //if it is a POST request then echo back the data.
      if (request.method == "POST") {
        var dataObj = JSON.parse(receivedData);
        console.log("received data object: ", dataObj);
        console.log("type: ", typeof dataObj);


        console.log("USER REQUEST: " + dataObj.text);
        var returnObj = {};// variable wil lbe returned to client
        var song_wordlist = [];// set song_wordlist for storing data if it exists
        let x_coordinate; // set x_coordinate for words
        let y_coordinate = 30;// set y_coordinate for words

        var filename = 'songs/' + dataObj.text + '.txt'; // set filename from user request

        fs.readFile(filename,function(err,data){
          if(err) {
            returnObj.text = dataObj.text;//Seting receivedData name
            returnObj.wordArray = song_wordlist;// set wordArray of returndata
            response.end(JSON.stringify(returnObj)); // sen JSON object to client
            return;// avoiding throw error, which causes sever shut down
          }

          var array = data.toString().split('\n');//if receivedData exits read data from txt file
          for(let i of array){// loop to read each lines of txt file
            var new_string = i.split(" "); // split words in a current line separately
            y_coordinate = 30 + y_coordinate; // set y_coordinate for words
            x_coordinate = 50;// set y_coordinate for words
            for(let a of new_string){ // read separeted word in a string
              song_wordlist.push({word:a ,x:x_coordinate, y:y_coordinate});// put word in a song word_list
              if(a.includes('i')) x_coordinate = x_coordinate - 20; // reduce word x_coordinate if word contains i character
              if(a.includes('m') || a.includes('n')) x_coordinate = x_coordinate + 10;// increase word x_coordinate if word contains m,n character
              x_coordinate = x_coordinate + (a.length*17); // set a new x_coordinate for incoming words
              }
            }
            returnObj.text = dataObj.text;//Seting receivedData name
            returnObj.wordArray = song_wordlist;// set wordArray of returndata
          //object to return to client
          response.writeHead(200, { "Content-Type": MIME_TYPES["txt"] });
          response.end(JSON.stringify(returnObj)); //send just the JSON object

        });
      }

      if (request.method == "GET") {
        //handle GET requests as static file requests
        var filePath = ROOT_DIR + urlObj.pathname;
        if (urlObj.pathname === "/") filePath = ROOT_DIR + "/index.html";

        fs.readFile(filePath, function(err, data) {
          if (err) {
            //report error to console
            console.log("ERROR: " + JSON.stringify(err));
            //respond with not found 404 to client
            response.writeHead(404);
            response.end(JSON.stringify(err));
            return;
          }
          response.writeHead(200, { "Content-Type": get_mime(filePath) });
          response.end(data);
        });
      }
    });
  })
  .listen(3000);

console.log("Server Running at http://127.0.0.1:3000  CNTL-C to quit");
