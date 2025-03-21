let ingredientIdListExact = [];
let ingredientIdListSimilar = [];
let ingredientNameList = [];
let infoDisplay = false;
let showResults = false; 
let noResults = false; 
let ingDisplayList = [];
var searchBarCont = []

document.addEventListener('DOMContentLoaded', () => {
    var infoContainer = document.querySelector("#info-toggle");
    var btnSubmit = document.querySelector('#btn-submit');
    var btnClear = document.querySelector("#btn-clear");
    var results = "";
    
    document.querySelector("#data-input").addEventListener("keyup", event => {
        if (event.key !== "Enter") return;
        document.querySelector("#btn-submit").click();
        event.preventDefault();
    })
    /* submit list and search for recipe */ 
  
    btnSubmit.addEventListener('click', () => {
        searchBarCont = []
        var dataInput = document.querySelector('#data-input');
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
                        searchBarCont.push(makeUpper(foo));
                        if(dataInput.value[i + 1] == " ") {
                            i++;
                        }
                        foo = "";
                    }
                    if (i == (dataInput.value.length - 1)) {
                        searchBarCont.push(makeUpper(foo));
                    }
                }
            }
            else {
                searchBarCont.push(makeUpper(dataInput.value));
            }
        } 

        /* check if search query already exists */
        
        /* switch between card-container and content-container */
        document.querySelector("#content-container").classList.add("fade-out"); 
        document.querySelector("#content-container").style.display = "none";
        document.querySelector("#cards-container").style.display = "block";


        /*  if more than one loop until all are identified */
        if (searchBarCont.length > 0) {
            if (ingredientNameList.includes(searchBarCont[0]) != true) { /* if search is already in data */
                for (let i = 0; i < searchBarCont.length; i++) {
                    if (ingredientNameList.includes(searchBarCont[0]) != true) {
                        document.querySelector("#results-cell-container").innerHTML = "";
                        fetch(`/get_ingredients/${searchBarCont[i]}`)
                        .then(response => response.json())
                        .then(response => {
                            let strResponse = JSON.stringify(response)
                            let fetchResults = JSON.parse(strResponse)
                            let exactResults = fetchResults["exact"]
                            let similarResults = fetchResults["similar"]

                            if (Object.keys(response).length === 0) {
                                document.querySelector('#data-message').innerHTML = 'No ingredient found';
                            }
                            else if(response['type'] == 0) {  /* if recipe */
                                document.querySelector("#results-cell-container").innerHTML = "";
                                document.querySelector("#ingredients-result").innerHTML += ingredientContainer(searchBarCont[i],response['id']);
                                document.querySelector('#results-cell-container').innerHTML += recipeContainer(response);
                                setTimeout(() => {
                                    var cells = document.querySelectorAll(".cell-container");
                                    cells.forEach((cell)=> {
                                        cell.classList.remove("fade-in");
                                    })
                                }, 600)
                                noResults = false;
                                btnClear.classList.add("fade-in");
                                
                                setTimeout(()=> {
                                    btnClear.style.display = "block";
                                }, 700);
                                setTimeout(()=> {
                                    btnClear.classList.remove("fade-in");
                                }, 2000)
                            }
                
                            else { /* if ingredients */
                                console.log(Object.keys(similarResults).length > 0)
                                if (exactResults) {
                                    ingredientIdListExact.push(exactResults['id']);
                                    document.querySelector("#ingredients-result").innerHTML += ingredientContainer(exactResults['name'],exactResults['id'], "exact");
                                    ingredientNameList.push(exactResults['name']);
                                } 
                                if ((Object.keys(similarResults).length > 0) == true) {
                                    document.querySelector("#ingredients-results-similar-title").style.display = "block";
                                    for (let j = 0; j < Object.keys(similarResults).length; j++) {
                                        ingredientIdListSimilar.push(similarResults[j]['id'])
                                        document.querySelector("#ingredients-results-similar").innerHTML += ingredientContainer(similarResults[j]['name'],similarResults[j]['id'], "similar");
                                    }
                                }
                                ingDisplayList.push(response['name']);
                                document.querySelector('#data-input').value = "";
                      
                                /* debug */ 
                                document.querySelector('#debug-ingredient-list').innerHTML = ingredientNameList;
                                document.querySelector("#debug-ingredient-id").innerHTML = ingredientIdListExact;
                                /* end debug */
                                
                                if (i == (searchBarCont.length - 1)) { /* when last of search bar */
                                    /* Search for recipes */ 
                                    search_recipe()
                                }    
                            }
                        
                        })
                    }
                } 
            }

            btnClear.classList.add("fade-in");
    
            setTimeout(()=> {
                btnClear.style.display = "block";
            }, 700);
            setTimeout(()=> {
                btnClear.classList.remove("fade-in");
            }, 2000)
        }
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

/* functions */

function search_recipe() {
    let idSearch = []
    for (i= 0; i < 2; i++) {
        if (i == 0) {
            idSearch = ingredientIdListExact;
        } else if (i == 1) {
            idSearch = ingredientIdListSimilar;
        }
        console.log("idSearch: " + idSearch)

        if (idSearch.length != 0) {
            document.querySelector("#results-cell-container").innerHTML = "";
            if (checkResults() == true){
                fetch(`/get_recipe/${idSearch}`)
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
                })
                showResults = true;
            } 
        }
    }
}

function recipeContainer(dict) {
    let container = 
        `<div class='cell-container fade-in'>
            <div class='result-cell'>
                <a href='/${dict['recipe_id']}/hey'>
                    <div class='result-img-container'>
                    <img id='${dict['recipe_id']}-img' src="${dict.recipe_image}" alt='' class="recipe-img">
                    </div>
                    <div class='result-text'>
                        <p class='result-name' >${dict['recipe_name']}</p>
                        <p style="font-style: italic;">${dict['recipe_time']}</p>
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
    ingredientIdListExact = [];
    ingredientNameList = [];
    ingDisplayList = [];
    searchBarCont = [];
    document.querySelector('#ingredients-result').innerHTML = "";
    document.querySelector('#ingredients-results-similar').innerHTML = "";
    document.querySelector("#ingredients-results-similar-title").style.display = "none";
    setTimeout(() => {
        document.querySelector("#btn-clear").classList.remove("fade-out");
        document.querySelector("#btn-clear").style.display= "none";
    }, 1000);
    console.log("ingredientIdListExact: " + ingredientIdListExact)

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

function getIngredient(string){
    fetch(`/get_ingredients/${string}`)
    .then(response => response.json())
    .then(response => {
        if (Object.keys(response).length === 0) {
            document.querySelector('#data-message').innerHTML = 'No ingredient found';
        }
        else {
            if (!ingredientIdListExact.includes(response['id'])) { 
                ingredientIdListExact.push(response['id']);
                ingredientNameList.push(response['name']);
                document.querySelector("#ingredients-result").innerHTML += ingredientContainer(string,response['id']);
                document.querySelector('#data-input').value = "";
                /* debug */ 
                document.querySelector('#debug-ingredient-list').innerHTML = ingredientNameList;
                document.querySelector("#debug-ingredient-id").innerHTML = ingredientIdListExact;
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

function ingredientContainer(name, id, relation){ 
    var html = 
        `<div class="ing-container" onClick="deleteIngredient(${id}, '${relation}')" id="ing-${id}">
            <p>${name}</p>
            <span> x</span>
        </div>`
    return html;
}

function deleteIngredient(id, relation) {
    if (relation == "exact") {
        let position = ingredientIdListExact.indexOf(id);
        ingredientIdListExact.splice(position,1);
        ingDisplayList.splice(position,1);
    } else if (relation == "similar") {
        let position = ingredientIdListSimilar.indexOf(id);
        ingredientIdListSimilar.splice(position,1);
        ingDisplayList.splice(position,1);
    }
    document.querySelector(`#ing-${id}`).classList.add("fade-out");
    document.querySelector("#results-cell-container").innerHTML = "";
    search_recipe()
    setTimeout(()=> {
        document.querySelector(`#ing-${id}`).remove();
    },1000);
    setTimeout(()=> {
        if (document.querySelector("#ingredients-results-similar").innerHTML == "") {
            document.querySelector("#ingredients-results-similar-title").style.display = "none";
        }
    },1200)
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
