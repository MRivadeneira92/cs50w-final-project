from django.db import models

class Ingredient_type(models.Model):
    ing_type_name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.ing_type_name}"

class Recipe_type(models.Model):
    re_type_name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.re_type_name

class Ingredient(models.Model):
    ingredient_name = models.CharField(max_length=100)
    ingredient_type = models.ManyToManyField(Ingredient_type)
    
    def __str__(self):
        return f"{self.id}; {self.ingredient_name}"

class Recipe(models.Model):
    recipe_name = models.CharField(max_length=100)
    recipe_description = models.CharField(max_length=60)
    recipe_ingredients = models.ManyToManyField(Ingredient, blank=True)
    recipe_ammounts = models.CharField(max_length=200)
    recipe_type = models.ManyToManyField(Recipe_type)
    steps = models.TextField(max_length=1000)
    recipe_time = models.CharField(max_length=100)
    recipe_image= models.ImageField(null=True, blank=True, upload_to="images/")
    recipe_image_credit = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.id}: {self.recipe_name}"
