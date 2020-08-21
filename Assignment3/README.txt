Version: Node v8.9.4 OS:windows 10 pro 64-bit

Install: npm install socket.io.

Launch:
node app.js

Testing:
http://localhost:3000/assignment3.html

WARNING:
Due to use multiple sockets to update players and moving balls(using polling) data
,thus the animation does not run smoothly.
It sometime leads to update issues such as:
Name of player doesn't appear on the canvas => losing controller
