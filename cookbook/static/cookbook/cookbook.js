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
                console.log(response)
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
    })
})


