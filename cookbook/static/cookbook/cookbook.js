let ingredientList = []

document.addEventListener('DOMContentLoaded', () => {

    /* get value from input  */ 
    let btnSubmit = document.querySelector('#btn-submit');
    btnSubmit.addEventListener("click", () => {
        var dataInput = document.querySelector('#data-input');
        if (dataInput.value != "") {
            fetch(`/get_ingredients/${dataInput.value}`)
            .then(response => response.json())
            .then(response => {
                if (response['result'] == false) {
                    document.querySelector('#data-message').innerHTML = 'No ingredient found';
                }
                else {
                    if (!ingredientList.includes(dataInput.value)) { 
                        ingredientList.push(dataInput.value);
                        dataInput.value = "";
                        /* debug */ 
                        document.querySelector('#debug-ingredient-list').innerHTML = ingredientList;

                    }
                    
                }
            })
        }
        
    
    }); 
})


