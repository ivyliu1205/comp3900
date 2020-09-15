from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.decorators import api_view

from .models import *
from users.utils import already_login

import json
import jwt

@api_view(["GET"])
def creators_recipes(request, creator_id):
    creatorObj = get_creator_by_id(creator_id)
    if not creatorObj:
        return JsonResponse({"message": "Fails to find the user"}, status=400)

    data = {}
    recipes = get_created_recipes_with_creator_id(creator_id)
    if not recipes:
        return JsonResponse(None, safe=False)
    else:
        data = {
            "name": creatorObj.email,
            "recipeIDs": [obj.id for obj in recipes]
        }
    return JsonResponse(data)

@api_view(["GET"])
def created_recipes(request):
    # CHECK user
    user = already_login(request)
    if not user:
        return _response_for_offline_user()
    
    recipes = get_created_recipes_with_creator_id(user.id)
    if not recipes:
        return JsonResponse([], safe=False)

    data = []
    for eachObj in recipes:
        save_recipe_into_response(data, eachObj, 'public', needSearchStep=False)
    response = JsonResponse(data, safe=False)
    return response

@api_view(["POST"])
def recipe_details(request):
    # CHECK user
    user = already_login(request)
    if not user:
        return _response_for_offline_user()

    recipe_id = _get_data_from_request(request, 'id', 'new')
    
    if recipe_id == 'new':
        return JsonResponse([], safe=False)

    recipeObj = get_recipe_with_id(recipe_id)
    if not recipeObj:
        return JsonResponse({"message": "Fails to get recipe"}, status=400)
    
    data = []
    save_recipe_into_response(data, recipeObj, 'public', needSearchStep=False)
    response = JsonResponse(data[0])
    return response

@api_view(["POST"])
def edit_recipe(request):
    # CHECK user
    user = already_login(request)
    if not user:
        return _response_for_offline_user()
    # CHECK new recipe 
    recipeId = _get_data_from_request(request, 'id')
    if not recipeId:  # New Recipe
        # print(json.loads(request.body))
        recipeId = save_new_recipe_into_database(user, json.loads(request.body))
    else:   # Not New Recipe
        recipeObj = get_recipe_with_id(recipeId)
        if not recipeObj:
            return JsonResponse({"message": "Fails to edit recipe"}, status=400)
        recipe_id = save_new_recipe_into_database(user, json.loads(request.body), recipeObj=recipeObj)
    
    recipeObj = get_recipe_with_id(recipeId)

    data = []
    save_recipe_into_response(data, recipeObj, 'public', needSearchStep=False)
    response = JsonResponse(data[0])
    response["Access-Control-Allow-Origin"] = "*"
    return response

@api_view(["POST"])
def edit_image(request):
    recipe_id = request.POST['id']
    recipeObj, created = Recipe.objects.get_or_create(id=recipe_id)
    if not created:
        imgList = get_image_with_recipe(recipeObj)
        imgList = save_image(recipeObj, request, imgList)
        delete_image(recipeObj, request, imgList)

        recipeObj.imgSrc = str(imgList)
        recipeObj.save()

        recipeObj = get_recipe_with_id(recipe_id)
        if recipeObj:
            data = []
            save_recipe_into_response(data, recipeObj, 'public', 'creatorId', needSearchStep=False)

            response = JsonResponse(data[0])
            return response

    return JsonResponse({"message": "Fails to upload image"}, status=400)



@api_view(["POST"])
def delete_recipe(request):
    recipe_id = _get_data_from_request(request, 'id')
    recipeObj = get_recipe_with_id(recipe_id)
    if not recipeObj:
        return JsonResponse({"message": "Fails to delete recipe"}, status=400)
    delete_recipe_from_database(recipeObj)
    return JsonResponse(None, safe=False)

"""
    Helper Functions
"""

# def handle_uploaded_file(f):

def _response_for_offline_user():
    data = {'message': 'User not Logged In'}
    response = JsonResponse(data, status=401)
    response["Access-Control-Allow-Origin"] = "*"
    return response

# Get the data of KEY from request body
# If there is no such Key, return default
def _get_data_from_request(request, key=None, default=None):
    data = json.loads(request.body)
    if key and key in data:
        return data[key]
    return default

# Get origin images from a string
# "['A']" -> ['A']
def _get_origin_image(imgs: str) -> list:
    images = []
    if not imgs or imgs == '[]':
        return images
    
    imgs = imgs.strip()
    if imgs[0] == '[' and imgs[-1] == ']':
        imgs = imgs[1:-1]
        images = [sub.strip()[1:-1] for sub in imgs.split(',')]
    else:
        images.append(imgs)
    return images