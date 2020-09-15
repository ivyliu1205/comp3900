from IPython.core import debugger
from typing import List, Dict, Any, Set, Optional
from django.db import models, transaction
from django.db.models import Q

import requests

from users.models import User
from .utils import SpoonacularData, SPOONACULAR_API_KEY

from dataclasses import dataclass


DEFAULT_RECIPE_IMAGE = 'http://127.0.0.1:8000/image/ph.png'


class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)


# ID starts from 0


class Cuisine(models.Model):
    name = models.CharField(max_length=64, unique=True)


# ID starts from 10000


class MealType(models.Model):
    name = models.CharField(max_length=64, unique=True)


# ID starts from 20000


class Utensil(models.Model):
    name = models.CharField(max_length=64, unique=True)


class Ingredient(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200)
    unit = models.CharField(max_length=50, blank=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.name


class Recipe(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=200, blank=False)
    link = models.CharField(max_length=200, blank=True)
    imgSrc = models.CharField(max_length=200, blank=True)
    cookTime = models.IntegerField(blank=True, null=True)
    createdBy = models.OneToOneField(
        User, on_delete=models.SET_NULL, blank=True, null=True)
    lastEdit = models.DateTimeField(auto_now=True)
    public = models.BooleanField(default=True)
    ingredients = models.ManyToManyField(
        Ingredient, through='RecipeIngredient')
    cuisines = models.ManyToManyField(Cuisine)
    mealTypes = models.ManyToManyField(MealType)
    utensils = models.ManyToManyField(Utensil)

    def __str__(self):
        return self.name


class Step(models.Model):
    number = models.SmallIntegerField()
    recipeId = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    details = models.TextField()

    class Meta:
        unique_together = ('number', 'recipeId')


class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.FloatField(blank=True, null=True)

    class Meta:
        unique_together = ['recipe', 'ingredient']


@dataclass
class SearchResult:
    recipes: List[Recipe]
    suggested_ingredients: Set[Ingredient]

# TODO use db. if insufficient, make api call


def search(ingredient_names: Set[str], cooking_time: Optional[int]) -> SearchResult:
    SUGGESTED_RECIPE_COUNT = 10
    if cooking_time:
        matched_recipes = Recipe.objects.filter(
            Q(cookTime__isnull=True) | Q(cookTime__lte=cooking_time))
    else:
        matched_recipes = Recipe.objects.all()

    def missing(recipe: Recipe):
        return {ing for ing in recipe.ingredients.all() if ing.name not in ingredient_names}
    matched_recipes = [r for r in matched_recipes if len(missing(r)) < 3]
    search_result = SearchResult(
        matched_recipes, _get_suggested_ingredients(ingredient_names))
    if len(matched_recipes) >= 10:
        return search_result
    # minimize missing ingredients
    params = {'apiKey': SPOONACULAR_API_KEY,
              'ingredients': ','.join(ingredient_names), 'number': str(SUGGESTED_RECIPE_COUNT), 'ranking': '2'}
    r = requests.get(
        'https://api.spoonacular.com/recipes/findByIngredients', params)
    r.raise_for_status()
    recipes_data = r.json()
    for recipe_data in recipes_data:
        try:
            recipe: Recipe = _parse_recipe_info_and_save(recipe_data['id'])
            if (not cooking_time) or (not recipe.cookTime) or (recipe.cookTime <= cooking_time):
                search_result.recipes.append(recipe)
        except AssertionError:
            # if the ingredient data fails the assertions, ignore it, since we are making suggestions
            pass

    return search_result

# suggested ingredients are those in recipes maximizing use of given ingredients and not already given
# TODO maybe factor in cooking time?


def _get_suggested_ingredients(ingredient_names: Set[str]) -> Set[Ingredient]:
    params = {'apiKey': SPOONACULAR_API_KEY,
              'ingredients': ','.join(ingredient_names), 'number': '5'}
    r: requests.Response = requests.get(
        'https://api.spoonacular.com/recipes/findByIngredients', params)
    r.raise_for_status()
    recipes_data: List[Dict[str, Any]] = r.json()

    suggested_ingredients = set()
    for recipe_data in recipes_data:
        result = _get_ingredients_from_recipe_data(recipe_data)
        suggested_ingredients.update(result.missing_ingredients)
    return suggested_ingredients

# get ingredients from recipes in https://spoonacular.com/food-api/docs#Search-Recipes-by-Ingredients


@dataclass
class RecipeSearchResult:
    missing_ingredients: Set[Ingredient]


def _get_ingredients_from_recipe_data(recipe_data: Dict[str, Any]) -> RecipeSearchResult:
    result = RecipeSearchResult(set())
    for ingredient_data in recipe_data['missedIngredients']:
        try:
            ingredient = _parse_ingredient_info_and_save(ingredient_data)
            result.missing_ingredients.add(ingredient)
        except AssertionError:
            # if the ingredient data fails the assertions, ignore it, since we are making suggestions
            pass
    for ingredient_data in recipe_data['usedIngredients']+recipe_data['unusedIngredients']:
        try:
            ingredient = _parse_ingredient_info_and_save(ingredient_data)
        except AssertionError:
            # if the ingredient data fails the assertions, ignore it, since we are just populating the db and the user shouldn't see anything
            pass
    return result

# Parse Ingredient information from
# https://spoonacular.com/food-api/docs#Get-Ingredient-Information
# https://spoonacular.com/food-api/docs#Search-Recipes-by-Ingredients
# https://spoonacular.com/food-api/docs#Get-Recipe-Information


def _parse_ingredient_info_and_save(raw_data: Dict[str, Any]) -> Ingredient:
    assert raw_data['id']
    try:
        unit = raw_data['shoppingListUnits'][0]
    except (KeyError, IndexError):
        unit = raw_data.get('unit') or ''
    try:
        aisle = raw_data['aisle']
        assert aisle and aisle != '?'
        category, _ = Category.objects.get_or_create(name=aisle)
    except (KeyError, AssertionError):
        category = None
    obj, _ = Ingredient.objects.update_or_create(
        id=raw_data['id'], defaults={'name': raw_data['name'], 'unit': unit, 'category': category})
    return obj


# Parse recipe information from https://spoonacular.com/food-api/docs#Get-Recipe-Information


@transaction.atomic
def _parse_recipe_info_and_save(id: int, raw_data: Dict[str, Any] = None) -> Recipe:
    recipe, created = Recipe.objects.get_or_create(id=id)
    if created:
        if not raw_data:
            raw_data = SpoonacularData().get_recipe_info_from_spoonacular(id)
        recipe.name = raw_data['title']
        recipe.link = raw_data.get('sourceUrl') or ''
        recipe.imgSrc = raw_data.get('image') or ''
        recipe.cookTime = raw_data.get('readyInMinutes')
        # Add ingredients
        for ing_data in raw_data['extendedIngredients']:
            ingredient = _parse_ingredient_info_and_save(ing_data)
            # Insert relations into RecipeIngredient model
            recipe.ingredients.add(
                ingredient,
                through_defaults={'quantity': ing_data['amount']}
            )

        # Add cuisines
        for cuisine in raw_data['cuisines']:
            cuisine, _ = Cuisine.objects.get_or_create(name=cuisine)
            recipe.cuisines.add(cuisine)

        # Add meal types
        for dish_type in raw_data['dishTypes']:
            meal_type, _ = MealType.objects.get_or_create(name=dish_type)
            recipe.mealTypes.add(meal_type)

        # Add Utensils
        data = SpoonacularData().get_equipment_info_from_spoonacular(recipe.id)
        for e in data['equipment']:
            utensil, _ = Utensil.objects.get_or_create(name=e['name'])
            recipe.utensils.add(utensil)

        recipe.save()

    return recipe


'''
    The following functions are used to create responses for views
'''
# Create response for /recipes
# Response with five random recipes form SPOONACULAR and save them into database


def response_with_random_recipes(number=5) -> Dict[str, Any]:
    response = {'recipes': [], 'suggestedIngredients': []}
    # If there are enough recipes in db
    if Recipe.objects.all().count() > number:
        objects = Recipe.objects.all()[:number]
        for eachObj in objects:
            save_recipe_into_response(response['recipes'], eachObj, 'own')
    else:
        data = SpoonacularData().get_random_recipes_from_spoonacular(number)

        for recipe_data in data['recipes']:
            try:
                # Save recipe data into database
                recipe = _parse_recipe_info_and_save(recipe_data['id'])
                # Create response for /recipes
                save_recipe_into_response(response['recipes'], recipe, 'own')
            except AssertionError:
                # if the recipe data fails the assertions, ignore it,
                pass

    return response

def response_with_matched_recipes(ingredient_names: Set[str], cooking_time: Optional[int]) -> dict:
    response = {'recipes': [], 'suggestedIngredients': []}
    searchResult = search(ingredient_names, cooking_time)
    for eachRecipe in searchResult.recipes:
        save_recipe_into_response(response['recipes'], eachRecipe, 'own')
    
    for eachIng in searchResult.suggested_ingredients:
        response['suggestedIngredients'].append(eachIng.name)

    # print('RESPONSE', response)
    return response

# Create response for /recipes/<recipe_id>


def response_with_recipe_details(recipe_id: int) -> Dict[str, Any]:
    try:
        recipeObj = Recipe.objects.get(id=recipe_id)
    except:
        print('Recipe Not Found')
        return None

    response = []
    save_recipe_into_response(response, recipeObj, 'own')
    return response[0]


# Return a list of imgs
def get_image_with_recipe(recipeObj) -> list:
    imgStr = recipeObj.imgSrc
    imgs = []
    if imgStr and imgStr != '[]':
        # The corresponding images are stored in 'Image' model
        if len(imgStr) > 2 and imgStr[0] == '[' and imgStr[-1] == ']':
            imgs = list([img.strip()[1:-1] for img in imgStr[1:-1].split(',')])
        else:
            imgs = [imgStr]
    return imgs if imgs else []


# Get category id by their name


def _get_category_id_by_name(name: str) -> int:
    obj, created = Category.objects.get_or_create(name=name)
    return obj.id


# Get all equipments for a recipe and save them into our database
@transaction.atomic
def _get_and_save_utensils_with_id(recipe_id):
    recipe, created = Recipe.objects.get_or_create(id=recipe_id)
    data = SpoonacularData().get_equipment_info_from_spoonacular(recipe_id)


@ transaction.atomic
def _get_and_save_steps_with_id(recipeObj, data=None):
    if not data:
        try:
            data = SpoonacularData().get_analyzed_recipe_info_from_spoonacular(recipeObj.id)
        except:
            data = []

    for each in data:
        # Store the steps for main dish
        if each['name'] == '':
            for eachStep in each['steps']:
                Step.objects.get_or_create(
                    number=eachStep['number'],
                    recipeId=recipeObj,
                    details=eachStep['step']
                )


# Help to get and save data in a list (dataList)
#   Get data from recipeObj, and save the details into dataList as a dict
def save_recipe_into_response(dataList, recipeObj, *argv, needSearchStep=True):
    # NEED TO CHANGE
    ingredients = list(
        recipeObj.ingredients.all().values('id', 'name', 'unit'))
    for eachIng in ingredients:
        try:
            eachIng['quantity'] = RecipeIngredient.objects.get(
                recipe=recipeObj.id, ingredient_id=eachIng['id']).quantity
            del eachIng['id']
        except:
            continue

    cuisines = list(recipeObj.cuisines.all().values_list(
        'name', flat=True)) if recipeObj.cuisines.all() else []
    mealtypes = list(recipeObj.mealTypes.all().values_list(
        'name', flat=True)) if recipeObj.mealTypes.all() else []
    utensils = list(recipeObj.utensils.all().values_list(
        'name', flat=True)) if recipeObj.utensils.all() else []
    images = get_image_with_recipe(recipeObj)

    stepObjs = Step.objects.filter(recipeId=recipeObj).order_by('number')
    if not stepObjs and needSearchStep:
        _get_and_save_steps_with_id(recipeObj)
        stepObjs = Step.objects.filter(recipeId=recipeObj).order_by('number')
    steps = list(stepObjs.values_list(
        'details', flat=True)) if stepObjs else []

    recipeDetail = {
        'id': recipeObj.id,
        'name': recipeObj.name,
        'imgSrcs': images,
        'ingredients': ingredients,
        'time': recipeObj.cookTime,
        'cuisines': cuisines,
        'mealTypes': mealtypes,
        'utensils': utensils,
        'steps': steps
    }

    if 'own' in argv:
        recipeDetail['own'] = True if recipeObj.createdBy_id else False

    if 'public' in argv:
        recipeDetail['public'] = recipeObj.public

    if 'creatorId' in argv:
        recipeDetail['creatorId'] = recipeObj.createdBy_id

    # NEED TO CHANGE
    if 'missingIngredients' in argv:
        recipeDetail['missingIngredients'] = []
    # print(recipeDetail)
    dataList.append(recipeDetail)
