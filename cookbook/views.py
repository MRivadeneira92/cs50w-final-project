from django.http import JsonResponse
from django.shortcuts import render
from .models import Ingredient, Recipe, Recipe_type
from django import forms

def index(request):
    return render(request, "cookbook/homepage.html")

def recipe_page(request, id, name):
    if (Recipe.objects.filter(id=id).exists()):
        recipe = Recipe.objects.get(id=id)
    else: 
        return render(request, "cookbook/not-found.html")
    
    ammounts = recipe.recipe_ammounts.split(', ')
    print(ammounts)
    return render(request, "cookbook/recipe.html", {
        "recipe": recipe,
        "ammounts": ammounts
    })

class NewRecipeForm(forms.Form): 
    Name = forms.CharField(max_length=100)
    Description = forms.CharField(max_length=200)
    Ingredients = forms.CharField(max_length=200)
    Type = forms.ModelMultipleChoiceField(queryset=Recipe_type.objects.all())
    Steps = forms.CharField(max_length=500)

# API

def get_ingredients(request, name, switch):
    result = {}
    if (switch == 0):
        # Check if ingredient exists
        if (Ingredient.objects.filter(ingredient_name=name).exists()): 
            ingredient = Ingredient.objects.get(ingredient_name=name)
            result["id"] = ingredient.id
            result["name"] = ingredient.ingredient_name 
    else:
        # Check if recipe exist 
        if(Recipe.objects.filter(recipe_name=name).exists()):
            recipe = Recipe.objects.get(recipe_name=name)
            result["id]"] = recipe.id
            result["name"] = recipe.recipe_name
    return JsonResponse(result)

def get_recipe(request, list):
    ingredients = list.split(",")
    search = []
    # turn list of str into ints
    for i in range(len(ingredients)):
        search.append(int(ingredients[i])) 

    # Filter results 
    recipe_query = Recipe.objects.all()

    no_result = True
    for i in range(len(search)):
        if(recipe_query.filter(recipe_ingredients=search[i]).exists()):
            recipe_query = recipe_query.filter(recipe_ingredients=search[i])
            no_result = False
    
    if no_result:
        result = {"recipe_id": "None"}
        return JsonResponse(result)
    
    # turn recipe_query into a list of recipes
    result = {}

    for i in range(len(recipe_query)):
        # make list of ingredients
        ingredients_query = recipe_query[i].recipe_ingredients.values()
        ingredients = []
        
        for q in ingredients_query: 
            ingredients.append(q["ingredient_name"])
        
        recipe_type = recipe_query[i].recipe_type.values()
        
        recipe = {
            "recipe_id": recipe_query[i].id,
            "recipe_desc": recipe_query[i].recipe_description,
            "recipe_name": str(recipe_query[i].recipe_name),
            "recipe_ingredients": ingredients,
            "recipe_type": str(recipe_type[0]["re_type_name"]),
            "steps": str(recipe_query[i].steps)
        }
        result[i] = recipe

    return JsonResponse(result)

def add(request): 
    if request.method == "GET":
        form = NewRecipeForm()
    else :
        form = NewRecipeForm(request.POST)
        if form.is_valid():
            #process ingredient into list 
            ing_raw = form.cleaned_data["Ingredients"]
            if ":" not in ing_raw:
                raise forms.ValidationError("Ammounts and ingredients must be separated by ':'")

            if "," not in ing_raw:
                raise forms.ValidationError("Ingredients must be separated by a comma ', '")    
            a = ing_raw.split(", ")
            ing = []
            for text in a :
                bar = text.split(":")
                ing.append(bar[1].strip(" "))

            ing_list = Ingredient.objects.all()
            id_ing = []
            for b in ing:
                if ing_list.filter(ingredient_name=b).first() is not None:
                    c = ing_list.get(ingredient_name=b)
                    id_ing.append(c.id)
                else: 
                    return render(request, "cookbook/add.html", {"form": form})
                
            # turn ingredients into ammount format
            x = form.cleaned_data["Ingredients"]
            ammounts = x.replace(":", " of")

            # create a new recipe with the data
            recipe = Recipe(
                recipe_name = form.cleaned_data["Name"],
                recipe_description = form.cleaned_data["Description"],
                steps = form.cleaned_data["Steps"],
                recipe_ammounts = ammounts
            )
            recipe.save()            
            recipe.recipe_type.set(form.cleaned_data["Type"])
            recipe.recipe_ingredients.set(id_ing)
    
    return render(request, "cookbook/add.html", {"form": form})