Table of Contents

# Introduction #

MICo (Missing Ingredients COokbook) is a site you can use when you don't know what to cook with the ingredients in your fridge. You can input the ingredients that you have and the website will return meals that used what you search. 

# How it works #

## How data is stored ##

In order for the page to be responsive the values of the first ingredient or recipe query is stored in two list declared during the page loading: _ingredientidListExact_ and _ingredientidListSimilar_. This lists can be modified in real time as the user removes or adds ingredients. This is accomplished by triggering the recipe search function when any of there two actions are done. The lists are modified accordinging and a new search is done, adapting the results on screen. 

## Getting values ##

The search bar accepts one or multiple ingredients. The have to be separated by a comma. The raw data is stored on a variable called ```dataInput```. An if statements checks if the data contains more than one ingredient by looking for a comma or a comma and space characters. If they are detected a few lines of code split the words inside the variable by reading each character one by one and separating the words when the character is a blank space or a comma. The resulting word is stored in an array while a function makes sure that the first letter of the ingredient is uppercase. 

The complete process: 

```
searchBarCont = []
var dataInput = document.querySelector('#data-input');
document.querySelector('#data-message').innerHTML = "";
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
```

The end result is an array with the words that will be used in the next step inside a variable called ```searchBarCont```.

## The search function ##

Each word stored in ```searchBarCont``` is used as input in an search function that looks for both ingredients and recipes that matches or includes it. 

The search function works two ways: The ingredient name triggers smaller functions within the bigger search funtion. First it looks for the _exact_ name, then for ingredients that contains the world (for example: inputting _egg_ will result in the ingredient _egg_ as an exact result and _egg whites_ as a similar result). After searching for ingredients the next step is looking for recipes that incorporate the name of the ingredient in their title (inputting _oats_ will get you as ingredients _oat flour_ and _Oats_, but also as recipes _oat_ meal pancakes and _Oat_ pizza crust). 

### First the ingredients ###

A loop is used to go through ```searchBarCont```. Each iteration is feed to ```get_ingredients```. This functions takes a name as an input. An empty dictionary is created named ```result```. We use a dictionary because of the need of storing both _exact_ and _similar_ ingredients, recipes, and their corresponding data. The initial check is if the name appears inside the ingredient database. If the check is positive the next step is looking for the _exact_ ingredient: 

```
if (Ingredient.objects.filter(ingredient_name=name).exists()): 
    ingredient = Ingredient.objects.filter(ingredient_name=name) 
    ing = {}
    ing["id"] = ingredient[0].id
    ing["name"] = ingredient[0].ingredient_name
    result["exact"] = ing
```

The _id_ and _name_ of the ingredient is saved using the key _exact_. 

Looking for similar ingredients uses almost the same lines of code: 

```
if (Ingredient.objects.filter(ingredient_name__icontains=name).exists()):
    ingredients = Ingredient.objects.filter(ingredient_name__icontains=name).exclude(ingredient_name=name)
    similar = []
    for ingredient in ingredients:
        ing = {}
        ing["id"] = ingredient.id
        ing["name"] = ingredient.ingredient_name 
        similar.append(ing)
    result["similar"] = similar
```

The _exact_ name of the ingredient is excluded so the query doesn't return the same result the query from earlier. Because there can be multiple ingredients with a similar name the results of the query are stored in a ```list``` by looping the through this results. As in the previous query, the final product is stored in a key named _similar_. 

The same function can look up recipes when the initial ingredients query is negative: 

```
if (Recipe.objects.filter(recipe_name=name)):
    recipe = Recipe.objects.get(recipe_name=name)
    result = {
        "recipe_id": recipe.id,
        "recipe_desc": recipe.recipe_description,
        "recipe_name": str(recipe.recipe_name),
        "recipe_type": str(recipe.recipe_type),
        "steps": str(recipe.steps),
        "recipe_time": recipe.recipe_time,
        "recipe_image": str(recipe.recipe_image)
    }
    result["id"] = recipe.id
    result["name"] = recipe.recipe_name

    # look for similar results
    if(Recipe.objects.filter(recipe_name__icontains=name).exists()):
        result = {}
        recipe = Recipe.objects.get(recipe_name__icontains=name)
        result = {
            "recipe_id": recipe.id,
            "recipe_desc": recipe.recipe_description,
            "recipe_name": str(recipe.recipe_name),
            "recipe_type": str(recipe.recipe_type),
            "steps": str(recipe.steps),
            "recipe_time": recipe.recipe_time,
            "recipe_image": str(recipe.recipe_image)
        }
        result["id"] = recipe.id
        result["name"] = recipe.recipe_name
        result["type"] = 0 # recipe
```

The logic for this queries are the same as for the ingredients.

### Then the results ###

The results are JSON parsed and stored in a dictionary. Results are separated between _exact_ and _similar_.

The function now splits depending on the _type_ of result (if recipe or ingredient).

If the results is a _recipe_ the data is presented in two ways. First the homepage is emptied by removing the HTML inside ```#results-cell-container```. Then the ingredient that triggered this recipe is inserted inside the ```#ingredients-result``` container. This container stores _exact_ recipe results. 

In order to show the ingredients from the search a new function is called. ```ingredientContainer``` takes the _name_, _id_ and _relation_(exact or similar) and outputs an individual container for each ingredient. The user can delete any ingredient and the recipes on the page will be modified on real time. This works with a function called ```deleteIngredient``` stored inside the container with the ingredient data.  This new function takes the ```id``` and ```relation``` of the ingredient. Using the ```relation``` the function selects between ```ingredientIdListExact``` and ```ingredientIdListSimilar```. The _indexOf_ method find the posision fo the _id_ inside each corresponding list, this is stored in an variable called ```position``` and this number is used along with the method _splice_ to remove the _id_ fron the corresponding list of ingredients. 

```
if (relation == "exact") {
    let position = ingredientIdListExact.indexOf(id);
    ingredientIdListExact.splice(position,1);
    ingDisplayList.splice(position,1);
} else if (relation == "similar") {
    let position = ingredientIdListSimilar.indexOf(id);
    ingredientIdListSimilar.splice(position,1);
    ingDisplayList.splice(position,1);
}
```

After the data is removed ````seach_recipe()``` is triggered updating the recipes on screen. The remaining lines takes care of deleting the container with a fade-out.

The recipes from the query are displayed using the function ```recipeContainer```. This function takes a _dictionary_ to fill the data inside the container. The function returns a html string. 

```
function recipeContainer(dict) {
    let container = 
        `<div class='cell-container fade-in'>
            <div class='result-cell cell-border'>
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
```

Each container is displayed using a fade-in animation. 

If the results are ingredients the data is separated with an if statement. The ingredients id is pushed to the corresponding list and the function _ingredientContainer()_ populates the div with the results. When there are similar results the div where they are placed is made visible.  

```
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
```

After everything is processed the function ```search_recipe()```  is triggered. 

### The search_recipe() function ### 

This functions makes a query to the view function _get_recipe_. It switches between exact and similar ingredients with a for loop. 

Inside the _get_recipe_ function the ingredient list is turned into a list of ints and saved in a variable called _search_. The next step is to filter through the database of recipes. The function is build so the search becomes narrower each time a new ingredient is queried. This is accomplished with a for loop using _search_. The first query uses the ingredient in the first position of _search_. The second query is done on the results of the first query. The parsed recipes are stored in a variable called _final_results_ 

```
for i in range(len(search)):
    if(recipe_query.filter(recipe_ingredients=search[i]).exists()): 
        recipe_query = recipe_query.filter(recipe_ingredients = search[i])
        no_result = False
```
_Each loop makes the search smaller_

The final step is to turn the query into a dictionary that stores each recipe as a corresponding dictionary. 

