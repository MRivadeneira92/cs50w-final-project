from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django import forms
import json
from .models import Ingredient, Recipe, Ingredient_type, Recipe_type

def index(request):
    return render(request, "cookbook/homepage.html")

def results(request):
        
    return render(request, "cookbook/results.html")

#API

def get_ingredients(request, name):
    # Check if ingredient exists
    result = False
    if (Ingredient.objects.filter(ingredient_name=name).exists()): 
        result = True
    print(f"result is {result}")

    return JsonResponse({"result": result})

