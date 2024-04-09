from django.contrib import admin
from .models import Ingredient_type, Recipe_type, Ingredient, Recipe

admin.site.register(Ingredient_type)
admin.site.register(Recipe_type)
admin.site.register(Ingredient)
admin.site.register(Recipe)