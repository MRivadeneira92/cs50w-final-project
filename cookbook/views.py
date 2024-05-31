from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django import forms
import json
from .models import Ingredient, Recipe, Ingredient_type, Recipe_type

def index(request):
    return render(request, "cookbook/homepage.html")

def recipe_page(request, id, name):
    if (Recipe.objects.filter(id=id).exists()):
        recipe = Recipe.objects.get(id=id)
    else: 
        return render(request, "cookbook/not-found.html")
    
    return render(request, "cookbook/recipe.html", {
        "recipe": recipe,
        "ingredients": recipe.recipe_ingredients.values()
    })

# API

def get_ingredients(request, name, switch):
    result = {}
    print(switch)
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

    for i in range(len(search)):
        if(recipe_query.filter(recipe_ingredients=search[i]).exists()):
            recipe_query = recipe_query.filter(recipe_ingredients=search[i])

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
