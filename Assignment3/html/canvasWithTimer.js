var pollingTimer; //timer to poll server for location updates

var canvas = document.getElementById("canvas1"); //our drawing canvas
var fontPointSize = 18; //point size for word text
var wordHeight = 20; //estimated height of a string in the editor
var editorFont = "Arial"; //font for your editor
var ball = {
  x :canvas.width/2,
  y : canvas.height/2,
  xDirection: 1,
  yDirection: 1,
  rad: 15,
  colour: 'Violet',
};

var player1 = {
  name: '',
  x: 30,
  y: canvas.height/3,
  width: 25,
  height: canvas.height/3,
  colour : 'Orange',
  score: 0,
};

var player2 = {
  name: '',
  x: canvas.width-50,
  y: canvas.height/3,
  width: 25,
  height: canvas.height/3,
  colour : 'SlateBlue',
  score: 0,
};

var drawCanvas = function() {
  var context = canvas.getContext("2d");

  context.fillStyle = "MediumSeaGreen";
  context.fillRect(0, 0, canvas.width, canvas.height); //erase canvas

  context.font = '20pt Arial';
  context.fillStyle = "LightSlateGray";
  context.strokeStyle = "blue";
  var battle_colour = 'Tomato';


  // Design battle:
    context.beginPath();
    context.moveTo(canvas.width/2,0);
    context.lineTo(canvas.width/2,canvas.width/2);
    context.stroke();

    context.beginPath();
    context.arc(canvas.width/2,canvas.height/2,canvas.height/3,0,2 * Math.PI);
    context.stroke();

    context.fillStyle = battle_colour;
    context.fillRect(0, 0, canvas.width, 20);

    context.fillStyle = battle_colour;
    context.fillRect(0, canvas.width/2-20, canvas.width, canvas.width/2);

    context.fillStyle = battle_colour;
    context.fillRect(0, 0, 20, canvas.height/3);

    context.fillStyle = battle_colour;
    context.fillRect(0, canvas.width/3, 20, canvas.width/2);

    context.fillStyle = battle_colour;
    context.fillRect(canvas.width-20, 0, canvas.width, canvas.width/6);

    context.fillStyle = battle_colour;
    context.fillRect(canvas.width-20, canvas.width/3, canvas.width, canvas.height);


    context.beginPath();
    context.arc(
      canvas.width/2, //x co-ord
      canvas.height/2, //y co-ord
      20, //radius
      0, //start angle
      2 * Math.PI //end angle
    );
    context.strokeStyle = battle_colour;
    context.fillStyle = battle_colour;
    context.fill();
    context.stroke();

  //draw moving ball
  context.beginPath();
  context.arc(
    ball.x, //x co-ord
    ball.y, //y co-ord
    ball.rad, //radius
    0, //start angle
    2 * Math.PI //end angle
  );
  context.strokeStyle = ball.colour;
  context.fillStyle = ball.colour;
  context.fill();
  context.stroke();


  //draw player 1
  context.strokeStyle = player1.colour;
  context.fillStyle = player1.colour;
  context.fillRect(player1.x,
	                 player1.y,
					 player1.width,
					 player1.height);
  context.stroke();


  //draw player 2
  context.strokeStyle = player2.colour;
  context.fillStyle = player2.colour;
  context.fillRect(player2.x,
                   player2.y,
           player2.width,
           player2.height);
  context.stroke();

  context.fillStyle = "LightSlateGray";
  context.strokeStyle = "blue";
  context.fillText(player1.name, 30,canvas.height*2/3+85);
  context.strokeText(player1.name, 30, canvas.height*2/3+85);
  context.fillText(player1.score, 30,canvas.height*2/3+110);
  context.strokeText(player1.score, 30, canvas.height*2/3+110);

  context.fillText(player2.name, canvas.width-100, canvas.height*2/3+85);
  context.strokeText(player2.name, canvas.width-100, canvas.height*2/3+85);
  context.fillText(player2.score, canvas.width-100,canvas.height*2/3+110);
  context.strokeText(player2.score, canvas.width-100, canvas.height*2/3+110);



};

function handleMouseDown(e) {
  //get mouse location relative to canvas top left
  var rect = canvas.getBoundingClientRect();
    //attache mouse move and mouse up handlers
    $("#canvas1").mousemove(handleMouseMove);
    $("#canvas1").mouseup(handleMouseUp);
  //  browser action
  e.stopPropagation();
  e.preventDefault();
  drawCanvas();
}

function handleMouseMove(e) {
  console.log("mouse move");
  //get mouse location relative to canvas top left
    e.stopPropagation();
  drawCanvas();
}

function handleMouseUp(e) {
  console.log("mouse up");
  //remove mouse move and mouse up handlers but leave mouse down handler
  $("#canvas1").off("mousemove", handleMouseMove); //remove mouse move handler
  $("#canvas1").off("mouseup", handleMouseUp); //remove mouse up handler
  drawCanvas(); //redraw the canvas
}



var ENTER = 13;
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var DOWN_ARROW = 40;

function handleKeyUp(e) {
  console.log("key UP: " + e.which);
  if(e.which == ENTER){ // enter is pressed
     handleSubmitButton();
     $('#userTextField').val('');
  }
}

var controller1 = [];
controller1.push({name: ''});// push controller1 name to avoid undefined in canvas
var controller2 = [];
controller2.push({name: ''});// push controller1 name to avoid undefined in canvas

function handleSubmitButton () {
  var userText = $('#userTextField').val(); //get text from user text input field
  if(userText && userText != ''){
   var userRequestObj = {text: userText}; //make object to send to server
   var userRequestJSON = JSON.stringify(userRequestObj);

   if(player1.name == ''){
     let colour = prompt("Type your favourite colour:"); // asking player to set their favourite colour
      player1.name = userText; // set player1 name
     player1.colour = colour; // set player1 colour
     controller1 = player1; // controller1 used to active player1
     controller1.name = userText; // make sure not losing user input
   }
   else if(player2.name == ''){
     let colour = prompt("Type your favourite colour:");// asking player to set their favourite colour
     player2.name = userText;// set player2 name
     player2.colour = colour;// set player2 colour
     controller2 = player2;// controller2 used to active player1
     controller2.name = userText;// make sure not losing user input
   }
   $('#userTextField').val('');
  }
}

function handleKeyDown(e) {
  console.log("keydown code = " + e.which);

  var dXY = 10; // player 1 speed
  if (e.which == DOWN_ARROW){ // key down pressed;
    if((controller1.y + controller1.height) < (canvas.height-20))
      controller1.y += dXY;
    else {
      controller1.y += (canvas.height-20 - controller1.y - controller1.height);
      }
  }
  if(e.which == UP_ARROW && controller1.y >= 0){// key up pressed
    if (controller1.y >= dXY+20)
      controller1.y -= dXY;
    else {
      controller1.y -= (controller1.y -20);
    }
  }

  var dataObj = {
    player1_name: player1.name,
    player2_name: player2.name,
    player1_score: player1.score,
    player2_score: player2.score,
    colour: controller1.colour,
    x: controller1.x,
    y: controller1.y,
    ball_x: ball.x,
    ball_y: ball.y,
   };
   //convert data to json string data type
  var jsonString = JSON.stringify(dataObj);
  //send data back to server
  socket.emit('MovingPlayer', jsonString)
}

function handleKeyDown1(e) {
  console.log("keydown code = " + e.which);

  var dXY = 10; //player2 speed
  if (e.which == DOWN_ARROW){ // key down pressed
    if((controller2.y + controller2.height) < (canvas.height-20))
      controller2.y += dXY;
    else {
      controller2.y += (canvas.height-20 - controller2.y - controller2.height);
      }
  }
  if(e.which == UP_ARROW && controller2.y >= 0){// key up pressed
    if (controller2.y >= dXY+20)
      controller2.y -= dXY; //up arrow
    else {
      controller2.y -= (controller2.y -20);
    }
  }

  var dataObj = {
    player1_name: player1.name,
    player2_name: player2.name,
    player1_score: player1.score,
    player2_score: player2.score,
    colour: controller2.colour,
     x: controller2.x,
    y: controller2.y,
    ball_x: ball.x,
    ball_y: ball.y,
   };
   //convert data to json string data type
  var jsonString = JSON.stringify(dataObj);
  //send data back to server
  socket.emit('MovingPlayer2', jsonString)
}


function movingball(){
  var speed = 5; //ball moving speeds
  //change the ball position
	ball.x = (ball.x + speed*ball.xDirection);
	ball.y = (ball.y + speed*ball.yDirection);

	//keep inbounds of canvas
  if(ball.x + ball.rad > canvas.width-20){
    //check ball position to decide upgrade score or change the direction of the ball
    if ((ball.y+ball.rad) >= canvas.height*1/3 &&
     (ball.y+ball.rad) <= canvas.height*2/3){
       player1.score += 1;
       ball.x = canvas.width/2;
       ball.y = canvas.height/2;
     }
     else ball.xDirection = -1;
  }
  //check ball position to decide upgrade score or change the direction of the ball
  if(ball.x + ball.rad < 55){
    if ((ball.y+ball.rad) >= canvas.height*1/3 &&
     (ball.y+ball.rad) <= canvas.height*2/3){
       player2.score += 1;
       ball.x = canvas.width/2;
       ball.y = canvas.height/2;
     }
     else ball.xDirection = 1;
  }
  //keep inbounds of canvas
  if(ball.y + ball.rad> canvas.height-20) ball.yDirection = -1;
  if(ball.y - ball.rad < 20) ball.yDirection = 1;
  var pucking_ball_y = ball.y + ball.rad;
  var pucking_ball_x = ball.x + ball.rad*2;
//keep inbounds of canvas
  if(pucking_ball_x == (player2.x+15)){
    if(pucking_ball_y >= player2.y && pucking_ball_y <= player2.y+player2.height+20){
      ball.xDirection = -1;
    }
  }
  //keep inbounds of canvas
  if(pucking_ball_x == (player1.x+ 2*player1.width+15)){
    if(pucking_ball_y >= player1.y && pucking_ball_y <= player1.y+player1.height+20){
      ball.xDirection = 1;
    }
  }


  var dataObj = {
              player1_score: player1.score,
              player2_score: player2.score,
              player1_name: player1.name,
              player2_name: player2.name,
              x: ball.x,
              y: ball.y,
              x_direction: ball.xDirection,
              y_direction: ball.xDirection,
              player1_x: player1.x,
              player1_y: player1.y,
              player2_x: player2.x,
              player2_y: player2.y,
              }
  //convert data to json string data type
  var jsonString = JSON.stringify(dataObj);
  // including handleKeyUp
  $(document).keyup(handleKeyUp);
  //send data movingball to server
  socket.emit('MovingBall', jsonString)
}


//connect to server and retain the socket

  var socket = io('http://' + window.document.location.host)

  //update ball position
  socket.on('MovingBall', function(data) {
    var locationData = JSON.parse(data);
      player2.name = locationData.player2_name;
      player2.x = locationData.player2_x;
      player2.y = locationData.player2_y;
      player2.score = locationData.player2_score;

      player1.x = locationData.player1_x;
      player1.y = locationData.player1_y;
      player1.score = locationData.player1_score;
      player1.name = locationData.player1_name;
    drawCanvas();
  })

  // use to update player1 data
  socket.on('MovingPlayer', function(data) {
    var locationData = JSON.parse(data);
      if(locationData.y != null){
      player1.name = locationData.player1_name;
      player1.x = locationData.x;
      player1.y = locationData.y;
      player1.colour = locationData.colour;

      player2.name = locationData.player2_name;
      ball.x = locationData.ball_x;
      ball.y = locationData.ball_y;
    }
    drawCanvas();
  })
  // use to update player2 data
  socket.on('MovingPlayer2', function(data) {
    var locationData = JSON.parse(data);
    if(locationData.y != null){
      player2.x = locationData.x;
      player2.y = locationData.y;
      player2.name = locationData.player2_name;
      player2.colour = locationData.colour;
      player1.name = locationData.player1_name;
      ball.x = locationData.ball_x;
      ball.y = locationData.ball_y;
    }
    drawCanvas();
  })
  //write clients on every clients
  socket.on('serverSays', function(data) {
  var msgDiv = document.getElementById('ConnectedClient');
  msgDiv.innerHTML = data.clients + " clients connected to server";
})



$(document).ready(function() {
  //add mouse down listener to our canvas object
  $("#canvas1").mousedown(handleMouseDown);
  //add keyboard handler to document
  $(document).keydown(handleKeyDown);

  $(document).keydown(handleKeyDown1);
  timer = setInterval(movingball, 15);

  drawCanvas();
})
