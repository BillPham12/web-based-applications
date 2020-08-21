function getIngredient() {
  //get ingredient input
    let IngredientName = document.getElementById('Ingredient').value;
    if(IngredientName === '') {
        return alert('Please enter an ingredient')
    }// if it doesn't exist then do alert;

    let information = document.getElementById('information')
    information.innerHTML = ''
    //information is div information to hold images and title
    //out HttpRequest
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        // if its on ready and sucessful connected then we need to add image url to the innerHTML, and also the title to its.
        if (xhr.readyState == 4 && xhr.status == 200) {
            let response = JSON.parse(xhr.responseText)
            for(let a = 0; a< response.count; a++){
              if(response.recipes[a+1]!= undefined){
              information.innerHTML = information.innerHTML +
              //setting table style, put source url to open new tab,
              // put image url to set up new images, and header for these images.
              `
              <table style = 'width :50%'>
                <td>
                  <a href =${response.recipes[a].source_url} target = "_blank">
                  <img src = ${response.recipes[a].image_url} width = "600" height = "400" border: "25">
                  <h2> ${response.recipes[a].title} </h2>
                  </a>
                </td>
                <td>
                  <a href =${response.recipes[a+1].source_url} target = "_blank">
                  <img src = ${response.recipes[a+1].image_url} width = "600" height = "400" border: "25">
                  <h2> ${response.recipes[a+1].title}</h2>
                  </a>
                  </td>
              </table>
                `
            }
            else{
              information.innerHTML = information.innerHTML +
              `
              <table style = 'width :50%'>
                <td>
                  <a href =${response.recipes[a].source_url} target = "_blank">
                  <img src = ${response.recipes[a].image_url} width = "600" height = "400" border: "25">
                  <h2> ${response.recipes[a].title} </h2>
                  </a>
                  </td>`
            }}
        }
    }
    xhr.open('GET', `/recipes?ingredients=${IngredientName}`, true)
    xhr.send();
}

//Attach Enter-key Handler
const ENTER=13
document.getElementById("Ingredient")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === ENTER) {
        document.getElementById("submit").click();
    }
});
