let ingredientIdList = []
let ingredientNameList = []
let infoDisplay = false;
let showResults = false; 
let noResults = false; 
let searchSwitch = 0; /* 0 == ingredient; 1 == recipe */

document.addEventListener('DOMContentLoaded', () => {
    var infoContainer = document.querySelector("#info-toggle");
    var btnSearch = document.querySelector('#btn-search');
    var btnSubmit = document.querySelector('#btn-submit');
    
    /* get value from input  */ 

    btnSearch.addEventListener('click', () => {
        var dataInput = document.querySelector('#data-input');
        var ingName = "";
        if (dataInput.value != "") {
            var dataList = []
            /* check for multiple ingredients on input */
            if (dataInput.value.includes(",") || dataInput.value.includes(", ")){
                let foo = ""
                for (let i = 0; i <= dataInput.value.length; i++){
                    if (dataInput.value[i] == " " && dataInput.value[i + 1] == ","){
                        continue;
                    }
                    if (dataInput.value[i] != ","){
                        foo += dataInput.value[i];
                    } 
                    else {
                        dataList.push(makeUpper(foo));
                        if(dataInput.value[i + 1] == " ") {
                            i++;
                        }
                        foo = "";
                    }
                    if (i == (dataInput.value.length - 1)) {
                        dataList.push(makeUpper(foo));
                    }
                }
            }
            else {
                ingName = makeUpper(dataInput.value);
            }

            /* check searchSwitch state */
            if (document.querySelector("#opt-checkbox").checked == true) {
                searchSwitch = 1; 
            }

            if (searchSwitch == 0) {
                /* search ingredients */
                if (dataList.length > 0){
                    for (let i = 0; i < dataList.length; i++){
                        getIngredient(dataList[i],searchSwitch);
                    }
                }
                else{
                    getIngredient(ingName,searchSwitch);
                }
            }           
        } 
        console.log("Ingredient list is " + ingredientIdList);  
    }); 

    /* submit list and search for recipe */ 
  
    btnSubmit.addEventListener('click', () => {
        console.log("hey");
        if (ingredientIdList.length != 0){
            document.querySelector("#results-cell-container").innerHTML = "";
            if (checkResults() == true){
                fetch(`/get_recipe/${ingredientIdList}`)
                .then(response => response.json())
                .then(list => {
                    console.log("response is" + list)
                    if(list["recipe_id"] == "None") {
                        document.querySelector("#results-cell-container").innerHTML = `<div id="results-info">No results<button class="button-style" onclick="clearContainer()">
                        Clear</button></div>`
                        noResults = true;
                    }
                    else {
                        document.querySelector('#results-container').innerHTML += `<div id="results-info"><h2>This is what we found</h2>
                        <button class="button-style" onclick="clearContainer()">Clear</button></div>`;
                        var numResults= Object.keys(list).length;
                        for (let i = 0; i < numResults; i++) {
                            document.querySelector('#results-cell-container').innerHTML += recipeContainer(list[i]);
                        }
                        setTimeout(() => {
                            var cells = document.querySelectorAll(".cell-container");
                            cells.forEach((cell)=> {
                                cell.classList.remove("fade-in");
                            })
                        }, 600)
                        noResults = false;
                    }  
                })
                showResults = true;
            } 
        }
    })

    /* slider */

    document.querySelector("#opt-ingredient").addEventListener("click", () => {
        document.querySelector("#opt-slider").click();
    })


    /* info menu */

    document.querySelector("#info-toggle").addEventListener("click", () => {
        
        const infoConSize = infoContainer.offsetHeight;
        var text = document.querySelector("#info-text");
        text.classList.toggle("show");
        if (infoDisplay == false) {
            infoDisplay = true;
            infoContainer.style.height = (infoConSize + text.offsetHeight) + "px";
        } else {
            infoContainer.style.height = "48px";
            infoDisplay = false;
        }
    })
})

function recipeContainer(dict) {
    let container = 
        `<div class='cell-container fade-in'>
            <div class='result-cell'>
                <a href='/${dict['recipe_id']}/hey'>
                    <div class='result-img-container'>
                    </div>
                    <div class='result-text'>
                        <p class='result-name' >${dict['recipe_name']}</p>
                        <p class='result-description'>${dict['recipe_desc']}</p>
                    </div>
                    </a>
                </div>
        </div>`
    return container
}

function clearContainer() {
    if(document.querySelector("#results-cell-container") != null){
        document.querySelector("#results-cell-container").innerHTML ="";
    }
    document.querySelector("#results-info").remove();
    showResults = false;
    noResults = false; 
}

function makeUpper(string) {
    let result = "";
    for (let i = 0; i < string.length; i++){
        if (i == 0){
            result = string[i].toUpperCase()
        }
        else{
            result += string[i].toLowerCase()
        }
    } 
    return result;
}

function getIngredient(string, switchOpt){
    fetch(`/get_ingredients/${string}/${switchOpt}`)
            .then(response => response.json())
            .then(response => {
                if (Object.keys(response).length === 0) {
                    document.querySelector('#data-message').innerHTML = 'No ingredient found';
                }
                else {
                    if (!ingredientIdList.includes(response['id'])) { 
                        ingredientIdList.push(response['id']);
                        ingredientNameList.push(response['name']);
                        document.querySelector("#ingredients-result").innerHTML += ingredientContainer(string,response['id']);
                        document.querySelector('#data-input').value = "";
                        
                        /* debug */ 
                        document.querySelector('#debug-ingredient-list').innerHTML = ingredientNameList;
                        document.querySelector("#debug-ingredient-id").innerHTML = ingredientIdList;
                    }        
                }
            })
}

function showInfo(){
    var infoText = document.querySelector("#info-text");
    infoText.removeAttribute("hidden");
    const reflow = element.offsetHeigth;
    infoText.classList.add("showInfo");
}

function ingredientContainer(name, id){ 
    var html = `<div class="ing-container" onClick="deleteIngredient(${id})" id="ing-${id}">
                    <p>${name}</p>
                    <span> x</span>
                </div>`
    return html;
}

function deleteIngredient(id) {
    let position = ingredientIdList.indexOf(id);
    ingredientIdList.splice(position);
    document.querySelector(`#ing-${id}`).classList.add("fade-out");
    setTimeout(()=> {
        document.querySelector(`#ing-${id}`).remove();
    },1000);
}

function checkResults(){
    if (document.querySelector("#results-cell-container").innerHTML === ""){
        return true;
    }
    else{ 
        if(noResults == true)
            return true;
        else {
            return false;
        }
    }
}