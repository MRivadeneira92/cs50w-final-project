let ingredientIdList = []
let ingredientNameList = []

document.addEventListener('DOMContentLoaded', () => {

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
                    if (dataInput.value[i] == " "){
                        continue;
                    }
                    if (dataInput.value[i] != ","){
                        foo += dataInput.value[i];
                    } 
                    else {
                        dataList.push(makeUpper(foo));
                        if(dataInput.value[i] == " ") {
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
            console.log(dataList);

            /* search ingredients */

            fetch(`/get_ingredients/${ingName}`)
            .then(response => response.json())
            .then(response => {
                if (Object.keys(response).length === 0) {
                    document.querySelector('#data-message').innerHTML = 'No ingredient found';
                }
                else {
                    if (!ingredientIdList.includes(response['id'])) { 
                        ingredientIdList.push(response['id']);
                        ingredientNameList.push(response['name'])
                        dataInput.value = "";
                        
                        /* debug */ 
                        document.querySelector('#debug-ingredient-list').innerHTML = ingredientNameList;
                        console.log(`Ingredient ids are ${ingredientIdList}`);
                    }
                    
                }
            })
        }  
    }); 

    /* submit list for searching recipe */ 

    btnSubmit.addEventListener('click', () => {
        fetch(`/get_recipe/${ingredientIdList}`)
        .then(response => response.json())
        .then(list => {
            document.querySelector('#results-container').innerHTML = '<h2>This is what we found</h2><button class="btn btn-primary" onclick="clearContainer()">Clear</button>' + 
            '<div id="results-cell-container" class="d-flex flex-row"></div>';
            var numResults= Object.keys(list).length;
            for (let i = 0; i < numResults; i++) {
                document.querySelector('#results-cell-container').innerHTML += recipeContainer(list[i]);
            }

            /* Trigger animation on cell when mouseout  */
            document.querySelectorAll('.result-cell').forEach(cell => {
                console.log(cell);
                cell.addEventListener('mouseleave', (event) => {
                    cell.classList.add('out');
                })
            })
        })
    })
})

function recipeContainer(dict) {
    let container = 
        `<div class='cell-container'>
            <div class='result-cell'>
                <a href='/${dict['recipe_id']}/hey'>
                    <div class='result-img-container'>
                    </div>
                    <div>
                        <p class='result-name' >${dict['recipe_name']}</p>
                        <p class='result-description'>${dict['recipe_desc']}</p>
                    </div>
                    </a>
                </div>
        </div>`
    return container
}

function clearContainer() {
    document.querySelector("#results-cell-container").innerHTML = "";
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