
const express = require('express') //express framework
const requestModule = require('request') //npm module for easy http requests
const PORT = process.env.PORT || 3000 // port
const API_KEY = 'xxxxxxxxxxxxxx' //API KEY
const app = express();
var path = require('path');
var favicon = require('serve-favicon');

//Middleware
app.use(express.static(__dirname + '/public')) //static server
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));//favicon

//Routes
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})
app.get('/index.html', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})
app.get('/recipes.html', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})
app.get('', (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})


// specical routes
app.get('/recipes', (request, response,next) => {
  if(request.url == '/recipes') // check for url /recipes to handle browser as normal
    response.sendFile(__dirname + '/views/index.html');
  else {
  let ingredient = request.query.ingredients; // receive ingredient, or a list of ingredients
  let ingredients = [];//create a list to hold a single ingredient or list of ingredients
  let string = '' // the name
  for(let i of ingredient){ // loop throught the input to define a single ingredient by passing , and ' ',
    if(i != ',' && i != " "){
        string += i;
      }
    else{
      ingredients.push(string);
      string = '';
      }
  }

  ingredients.push(string); // push ingredients to a list
  if(!ingredient) { // if ingredient does not exists then send json message to browser;
           return response.sendFile(__dirname + '/views/error.html');
  }

  var big_data = {count: 0, recipes: []};// create big data which will hold a list of ingredients or a single ingredient data
  var current_data = {}; // to keep tracking each ingredient data
  for(let a =0; a< ingredients.length;a++){// loop through the list hold ingredients name
    var url = `http://food2fork.com/api/search?q=${ingredients[a]}&key=${API_KEY}`// our url
    //put ingredient data to big data
    requestModule.get(url, (req, res, data) => {
        current_data = JSON.parse(data);
        big_data.count += current_data.count;
        for(let b = 0; b < current_data.recipes.length;b++){
        big_data.recipes.push(current_data.recipes[b]);
      }
      if(a+1 === ingredients.length) // if this is the last one then send it to clients.
      //check for the request header file if it is one of the defined sendFile then send json back
        if(request.headers.referer)
            return response.json(big_data);
        else{// else statement happens when the app doesn't start yet, so we need to create a page then send request to the server.
          sendResponse(big_data,response);
        }
      });
    }
  }
})

//function create a page as index html, then add data to the the page
//finally we send it back to the client
function sendResponse(big_data,response){

  var page =
  `<html lang="en">
    <head>
      <title>A4 COMP2406</title>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="styles/styles.css">
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
  <style>
  table {
      border-spacing: 50px;
      padding = 0;
  }
  td{
    border-spacing: 50px;
    border: 1px solid black;
    border-right:  = 50px;
    border-bottom:  = 50px;
    padding = 0;

  }
  h2{
    text-align: center;
    font-size: 22px;
    font-style: italic;
  }

  </style>

  </head>

  <body>
      <div class="container">
          <div class="wrapper">
              Enter an ingredient: <input type="text" value = '' name="Ingredient" id="Ingredient" />
              <button id="submit" onclick="getIngredient()" style="margin-bottom: 50px;">Submit</button>
          </div>
          <div id="information">
  `
for(let a = 0; a< big_data.count; a++){
if(big_data.recipes[a+1]!= undefined){
page += `<table style = 'width :50%'>
<td>
<a href =${big_data.recipes[a].source_url} target = "_blank">
<img src = ${big_data.recipes[a].image_url} width = "600" height = "400" border: "25">
<h2> ${big_data.recipes[a].title} </h2>
</a>
</td>
<td>
<a href =${big_data.recipes[a+1].source_url} target = "_blank">
<img src = ${big_data.recipes[a+1].image_url} width = "600" height = "400" border: "25">
<h2> ${big_data.recipes[a+1].title}</h2>
</a>
</td>
</table>
`
}
else{

page +=`<table style = 'width :50%'>
<td>
<a href =${big_data.recipes[a].source_url} target = "_blank">
<img src = ${big_data.recipes[a].image_url} width = "600" height = "400" border: "25">
<h2> ${big_data.recipes[a].title} </h2>
</a>
</td>`
}
}
page +=`</div>
  </div>
  <script src="js/script.js"></script>
  </body>
  </html>
      `
return response.send(page);
}


//start server
app.listen(PORT, err => {
  if(err) console.log(err)
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To Test:  http://localhost:3000/recipes.html`)
    console.log(`To Test:  http://localhost:3000/recipes`)
    console.log(`To Test:  http://localhost:3000/index.html`)
    console.log(`To Test:  http://localhost:3000/`)
    console.log(`To Test:  http://localhost:3000`)

  }
})
