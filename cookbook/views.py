from django.http import JsonResponse
from django.shortcuts import render
from .models import Ingredient, Recipe, Recipe_type
from django import forms

class NewRecipeForm(forms.Form): 
    Name = forms.CharField(max_length=100)
    Description = forms.CharField(max_length=200)
    Time = forms.CharField(max_length=100)
    Ingredients = forms.CharField(max_length=200)
    Type = forms.ModelMultipleChoiceField(queryset=Recipe_type.objects.all())
    Steps = forms.CharField(widget=forms.Textarea)
    Image = forms.ImageField()

def index(request):
    if (request.method == "POST"):
        recipe_main_article = Recipe.objects.get(id=request.POST["recipe_main_article"])
        recipe01 = Recipe.objects.get(id=request.POST["recipe-select-01"])
        recipe02 = Recipe.objects.get(id=request.POST["recipe-select-02"])
        return render(request, "cookbook/homepage.html", {"recipe_main_article": recipe_main_article, "recipe01": recipe01, "recipe02": recipe02})
    else:
        return render(request, "cookbook/homepage.html")

def recipe_page(request, id, name):
    if (Recipe.objects.filter(id=id).exists()):
        recipe = Recipe.objects.get(id=id)
    else: 
        return render(request, "cookbook/not-found.html")
    ammounts = recipe.recipe_ammounts.split(', ')
    return render(request, "cookbook/recipe.html", {
        "recipe": recipe,
        "ammounts": ammounts
    })

def all_recipes(request): 
    menu = Recipe.objects.all()
    return render(request, "cookbook/all-recipes.html", { "menu": menu})

# API

def get_ingredients(request, name):
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
        return JsonResponse(result)
    
    # Check if ingredient exists
    elif (Ingredient.objects.filter(ingredient_name__icontains=name).exists()): 
        result = []
        ingredients = Ingredient.objects.filter(ingredient_name__icontains=name)
        for ingredient in ingredients:
            ing = {}
            ing["id"] = ingredient.id
            ing["name"] = ingredient.ingredient_name 
            result.append(ing)
        return JsonResponse(result, safe=False)


def get_recipe(request, id_list):
    ingredients = id_list.split(",")
    search = []
    # turn list of str into ints
    for i in range(len(ingredients)):
        search.append(int(ingredients[i])) 

    # Filter results 
    recipe_query = Recipe.objects.all()
    no_result = True


    # search por multiple recipes #
    final_results = {}
    for i in range(len(search)):
        mid_results = {}
        if(recipe_query.filter(recipe_ingredients=search[i]).exists()): 
            mid_results = set(recipe_query.filter(recipe_ingredients=search[i]).values_list("id", flat=True))
            if (bool(final_results) == False):
                final_results = mid_results
            else:
                final_results.update(mid_results)
    final_results = list(final_results)
    # end search #
    recipe_results = []
    for i in range(len(final_results)):
        if(recipe_query.filter(id=final_results[i])):
            foo = recipe_query.filter(id=final_results[i])
            recipe_results.append(foo[0])
            no_result = False
        
    if no_result:
        result = {"recipe_id": "None"}
        return JsonResponse(result)
    
    print(recipe_results)
    # turn recipe_query into a list of recipes
    result = {}
    for i in range(len(recipe_results)):
        # make list of ingredients
        ingredients_query = recipe_results[i].recipe_ingredients.values()
        ingredients = []
        
        for q in ingredients_query: 
            ingredients.append(q["ingredient_name"])
        
        recipe_type = recipe_results[i].recipe_type.values()
        recipe = {
            "recipe_id": recipe_results[i].id,
            "recipe_desc": recipe_results[i].recipe_description,
            "recipe_name": str(recipe_results[i].recipe_name),
            "recipe_ingredients": ingredients,
            "recipe_type": str(recipe_type[0]["re_type_name"]),
            "steps": str(recipe_results[i].steps),
            "recipe_time": recipe_results[i].recipe_time,
            "recipe_image": str(recipe_results[i].recipe_image)
        }
        result[i] = recipe
    return JsonResponse(result)

def add(request): 
    if request.method == "GET":
        form = NewRecipeForm()
    else :
        form = NewRecipeForm(request.POST, request.FILES)
        if form.is_valid():
            #process ingredient into list 
            ing_raw = form.cleaned_data["Ingredients"]
            if ":" not in ing_raw:
                return render(request, "cookbook/add.html", {"form": form, "Message": "Ammounts and ingredients must be separated by ':'"})

            if "," not in ing_raw:
                return render(request, "cookbook/add.html", {"form": form, "Message": "Ingredients must be separated by a comma ', '"})
            a = ing_raw.split(", ")
            ing = []
            for text in a :
                bar = text.split(":")
                ing.append(bar[1].strip(" "))

            ing_list = Ingredient.objects.all()
            id_ing = []
            for b in ing:
                if ing_list.filter(ingredient_name=b.capitalize()).first() is not None:
                    c = ing_list.get(ingredient_name=b.capitalize())
                    id_ing.append(c.id)
                else: 
                    return render(request, "cookbook/add.html", {"form": form, "error": b})
                
            # turn ingredients into ammount format
            x = form.cleaned_data["Ingredients"]
            ammounts = x.replace(":", " of")

            # create a new recipe with the data
            recipe = Recipe(
                recipe_name = form.cleaned_data["Name"],
                recipe_description = form.cleaned_data["Description"],
                steps = form.cleaned_data["Steps"],
                recipe_ammounts = ammounts,
                recipe_time = form.cleaned_data["Time"],
                recipe_image = form.cleaned_data["Image"]
            )
            recipe.save()            
            recipe.recipe_type.set(form.cleaned_data["Type"])
            recipe.recipe_ingredients.set(id_ing)
        return render(request, "cookbook/add.html", {"form": form, "Message": "Recipe added  succesfully"})
    
    ingredients = Ingredient.objects.all()  
    return render(request, "cookbook/add.html", {"form": form, "ingredients": ingredients})

def homepage_editor(request):
    all = Recipe.objects.all()

    return render(request, "cookbook/homepage-editor.html", {"recipes": all})
