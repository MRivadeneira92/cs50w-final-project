let ingredientIdList = []
let ingredientNameList = []

document.addEventListener('DOMContentLoaded', () => {

    var btnSearch = document.querySelector('#btn-search');
    var btnSubmit = document.querySelector('#btn-submit');
    
    /* get value from input  */ 

    btnSearch.addEventListener('click', () => {
        var dataInput = document.querySelector('#data-input');
        if (dataInput.value != "") {
            fetch(`/get_ingredients/${dataInput.value}`)
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
            console.log(list[0]['recipe_name']);
            document.querySelector('#results-container').innerHTML = recipeContainer(list[0]);
        })
    })
})

function recipeContainer(dict) {
    let container = 
        `<div class='result-cell'>
            <div class='result-img-container'>
                <img src='https://restaurantden.wpenginepowered.com/wp-content/uploads/2017/09/free-stock-food-photography-websites.jpg' alt='food placeholder'> 
            </div>
            <div>
                <p class='result-name' >${dict['recipe_name']}</p>
                <p class='result-description'>${dict-['recipe_steps']}</p>
            </div>
        </div>
        `
}
