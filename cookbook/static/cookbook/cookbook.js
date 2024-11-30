let ingredientIdList = [];
let ingredientNameList = [];
let infoDisplay = false;
let showResults = false; 
let noResults = false; 
let searchSwitch = 0; /* 0 == ingredient; 1 == recipe */
let ingDisplayList = [];
document.addEventListener('DOMContentLoaded', () => {
    var infoContainer = document.querySelector("#info-toggle");
    var btnSubmit = document.querySelector('#btn-submit');
    var btnClear = document.querySelector("#btn-clear");
    var results = "";

    /* submit list and search for recipe */ 
  
    btnSubmit.addEventListener('click', () => {
        var dataList = []
        var dataInput = document.querySelector('#data-input');
        var ingName = "";
        if (dataInput.value != "") {
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
                dataList.push(makeUpper(dataInput.value));
            }
            /* check searchSwitch state */
            if (document.querySelector("#opt-checkbox").checked == true) {
                searchSwitch = 1; 
            }
        } 
        else if (dataInput.value == "" && showResults) {
            dataList = ingDisplayList;
        }

        /* switch between card-container and content-container */
        document.querySelector("#content-container").classList.add("fade-out"); 
        setTimeout(() => {
            document.querySelector("#content-container").style.display = "none";
        },3000)
        setTimeout(() => {
            document.querySelector("#cards-container").style.display = "block";

        },4000)

        if (searchSwitch == 0) {
            console.log("dataList in search ing: " + dataList);

            /*  if more than one loop until all are identified */
            if (dataList.length > 0) {
                for (let i = 0; i < dataList.length; i++) {
                    fetch(`/get_ingredients/${dataList[i]}/${searchSwitch}`)
                    .then(response => response.json())
                    .then(response => {
                        if (Object.keys(response).length === 0) {
                            document.querySelector('#data-message').innerHTML = 'No ingredient found';
                        }
                        else {
                            if (!ingredientIdList.includes(response['id'])) { 
                                ingredientIdList.push(response['id']);
                                ingredientNameList.push(response['name']);
                                ingDisplayList.push(response['name']);
                                document.querySelector("#ingredients-result").innerHTML += ingredientContainer(dataList[i],response['id']);
                                document.querySelector('#data-input').value = "";
                                /* debug */ 
                                document.querySelector('#debug-ingredient-list').innerHTML = ingredientNameList;
                                document.querySelector("#debug-ingredient-id").innerHTML = ingredientIdList;
                            }        
                        }
                        if (i == (dataList.length - 1)) {
                            /* Search for recipes */ 
                            if (ingredientIdList.length != 0) {
                                document.querySelector("#results-cell-container").innerHTML = "";
                                if (checkResults() == true){
                                    fetch(`/get_recipe/${ingredientIdList}`)
                                    .then(response => response.json())
                                    .then(list => {
                                        if(list["recipe_id"] == "None") {
                                            document.querySelector("#results-cell-container").innerHTML = '<p class="fade-in">No results</p>';
                                            noResults = true;
                                        }
                                        else {
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
                                        btnClear.classList.add("fade-in");
            
                                        setTimeout(()=> {
                                            btnClear.style.display = "block";
                                        }, 700);
                                        setTimeout(()=> {
                                            btnClear.classList.remove("fade-in");
                                        }, 2000)
            
                                    })
                                    showResults = true;
                                } 
                            }
                        }
                    })
                }
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
    if(document.querySelector("#results-cell-container") != null) {
        document.querySelector("#results-cell-container").innerHTML ="<p class='fade-in'>Welcome. This space is for results</p>";
    }
    showResults = false;
    noResults = false; 
    document.querySelector("#btn-clear").classList.add("fade-out");
    ingredientIdList = [];
    ingDisplayList = [];
    document.querySelector('#ingredients-result').innerHTML = "";
    setTimeout(() => {
        document.querySelector("#btn-clear").classList.remove("fade-out");
        document.querySelector("#btn-clear").style.display= "none";
    }, 1000);
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
    var html = 
        `<div class="ing-container" onClick="deleteIngredient(${id})" id="ing-${id}">
            <p>${name}</p>
            <span> x</span>
        </div>`
    return html;
}

function deleteIngredient(id) {
    let position = ingredientIdList.indexOf(id);
    ingredientIdList.splice(position);
    ingDisplayList.splice(position);
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

function fadeIn(id) {
    document.querySelector(id).classList.add("fade-in");
    setTimeout(()=> {
        document.querySelector(id).classList.remove("fade-in")
    }, 600)
}
