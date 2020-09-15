from django.http import JsonResponse
from rest_framework.decorators import api_view
from .models import *

import json

''' labels/
'''


@api_view(["GET"])
def get_labels(request):
    # print('#Ingredient = {}'.format(Ingredient.objects.all().count()))

    ingredients = _get_ingredient_label()
    cuisines = list(Cuisine.objects.all().values_list('name', flat=True).order_by('name'))
    mealTypes = list(MealType.objects.all().values_list('name', flat=True).order_by('name'))
    
    data = {
        "ingredients": ingredients,
        "cuisines": cuisines,
        "mealTypes": mealTypes,
        "utensils": []
    }
    # print(data)
    response = JsonResponse(data)
    return response


''' recipes/
'''


@api_view(["GET", "POST"])
def get_matched_recipes(request):
    requestData = json.loads(request.body)
    if request.method == "GET" or (not requestData['ingredients'] and not requestData['maxTime']):
        data = response_with_random_recipes(number=50)
    else:
        ingredients = set([curr['name'] for curr in requestData['ingredients']])
        maxTime = requestData['maxTime']
        data = response_with_matched_recipes(ingredients, maxTime)
    response = JsonResponse(data)
    return response


@api_view(['GET'])
def get_recipe_details(request, recipe_id):
    data = response_with_recipe_details(recipe_id)
    return JsonResponse(data) if data else JsonResponse({'Message': 'Recipe not found'}, status=400)


# Helper Functions

# To make it quicker to run, we only show the first thirty ingredients of eact category.


def _get_ingredient_label():
    data = {}
    category = list(Category.objects.values('name', 'id').order_by('name'))
    for each in category:
        data[each['name']] = list(Ingredient.objects.filter(category=each['id']).values('name').distinct().order_by('name'))
    data['Others'] = list(Ingredient.objects.filter(category__isnull=True).values('name').distinct().order_by('name'))
    # print(data)
    return data
