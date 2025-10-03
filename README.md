Table of Contents

# Introduction #

MICo (Missing Ingredients COokbook) is a site you can use when you don't know what to cook with the ingredients in your fridge. You can input the ingredients that you have and the website will return meals that used what you search. 

# How it works #

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

## The search function ##

The search function works two ways: The ingredient name triggers smaller functions within the bigger search funtion. First it looks for the _exact_ name, then for ingredients that contains the world (for example: inputting _egg_ will result in the ingredient _egg_ as an exact result and _egg whites_ as a similar result). After searching for ingredients the next step is looking for recipes that incorporate the name of the ingredient in their title (inputting _oats_ will get you as ingredients _oat flour_ and _Oats_, but also as recipes _oat_ meal pancakes and _Oat_ pizza crust). 

### First the ingredients ###

The first step is looking for matching ingredients. This is handled by a fetch to ```get_igredients```. This functions takes the name of the ingredient as an input. An empty dictionary is created named ```result```. We use a dictionary because of the need of storing both _exact_ and _similar_ ingredients, recipes, and their corresponding data. The initial check is if the name appears inside the ingredient database. If the check is positive the next step is looking for the _exact_ ingredient: 

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
