from django.db import models, transaction
from recipes.models import *
from users.models import *

from random import randrange

DOMAIN = 'http://127.0.0.1:8000/'

class Image(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    img = models.ImageField(upload_to='recipes')

# Get creator by his/her ID
#   - If not found the user, return None
def get_creator_by_id(creator_id: int):
    try:
        return User.objects.get(id=creator_id)
    except:
        return None

# Get all the recipes created by the creator
def get_created_recipes_with_creator_id(creator_id: int):
    return Recipe.objects.filter(createdBy=get_creator_by_id(creator_id))

# Get the recipe object by its ID
#   If no such recipe, return None
def get_recipe_with_id(recipe_id):
    try:
        return Recipe.objects.get(id=recipe_id)
    except:
        return None


def get_last_edit_time_with_recipe_id(recipe_id):
    try:
        recipeObj = Recipe.objects.get(id=recipe_id)
    except:
        return None

    return recipeObj.lastEdit

@transaction.atomic
def delete_recipe_from_database(recipeObj):
    recipeObj.delete()

# Save all details of new recipe into db and return its ID
#   - ID is a random number generated with User Id
# Return new recipe's ID
@transaction.atomic
def save_new_recipe_into_database(creatorObj, editData, recipeObj=None) -> int:
    if not recipeObj:
        recipeObj, created = Recipe.objects.get_or_create(id=randrange(2000, 5000) * randrange(2, 500))
        # If the data is occupied, then generate again
        if not created:
            return self.save_new_recipe_into_database(creatorObj, editData, recipeObj)

    recipeObj.createdBy_id = creatorObj.id
    recipeObj.public = editData['public']
    recipeObj.name = editData['name']
    recipeObj.cookTime = editData['time']
    recipeObj.save()

    if editData['ingredients']:
        _save_ingredients_info(recipeObj, editData['ingredients'])
    else:
        RecipeIngredient.objects.filter(recipe=recipeObj).delete()

    if editData['cuisines']:
        _save_cuisines_with_name(recipeObj, editData['cuisines'])
    else:
        recipeObj.cuisines.all().delete()
        
    if editData['mealTypes']:
        _save_mealTypes_with_name(recipeObj, editData['mealTypes'])
    else:
        recipeObj.mealTypes.all().delete()
        
    if editData['utensils']:
        _save_utensils_with_name(recipeObj, editData['utensils'])
    else:
        recipeObj.utensils.all().delete()
        
    if editData['steps']:
        _save_steps_with_id(recipeObj, editData['steps'])
    else:
        Step.objects.filter(recipeId_id=recipeObj.id).delete()

    return recipeObj.id

# Return TRUE, if success
# Return FALSE, if failed
@transaction.atomic
def save_image(recipeObj, request, imgList):
    newIndex = 0
    while True:
        try:
            newImage = request.FILES['newimage' + str(newIndex)]
            if not newImage: break
            imgObj, created = Image.objects.get_or_create(recipe=recipeObj, img=newImage)
            outputName = _get_img_output_name(imgObj.img)
            imgList.append(outputName)
            newIndex += 1
        except:
            break
    return imgList

# Return TRUE, if success
# Return FALSE, if failed
@transaction.atomic
def delete_image(recipeObj, request, imgList):
    deleteIndex = 0
    while True:
        try:
            deleteImage = request.POST['deleteimage' + str(deleteIndex)]
            if not deleteImage: break
            dbname = _get_img_name_in_database(deleteImage)
            # print(dbname)
            Image.objects.get(recipe=recipeObj, img=_get_img_name_in_database(deleteImage)).delete()
            imgList.remove(deleteImage)
            deleteIndex += 1
        except:
            break


'''
    Helper Functions
'''
# 'http://127.0.0.1:8000/image/sirloin_steak2_Cg58uzn.jpg'
#  Change to 'recipes/sirloin_steak2_Cg58uzn.jpg'
def _get_img_name_in_database(outputString) -> str:
    picName = list(outputString.split('/'))[-1]
    return 'recipes/' + picName

# 'recipes/sirloin_steak2_Cg58uzn.jpg' change to
# 'http://127.0.0.1:8000/image/sirloin_steak2_Cg58uzn.jpg'
def _get_img_output_name(dbName) -> str:
    return DOMAIN + 'image/' + str(dbName).split('/')[1]


# Save steps into database
def _save_steps_with_id(recipeObj, stepList):
    Step.objects.filter(recipeId_id=recipeObj.id).delete()
    index = 1
    for eachStep in stepList:
        Step.objects.get_or_create(
            number=index, 
            recipeId=recipeObj, 
            details=eachStep
        )
        index += 1

# Save utensil info of a recipe
def _save_utensils_with_name(recipeObj, utensilList):
    recipeObj.utensils.all().delete()
    for each in utensilList:
        utensil, created = Utensil.objects.get_or_create(name=each)
        recipeObj.utensils.add(utensil)
        recipeObj.save()

# Save mealTypes info of a recipe
def _save_mealTypes_with_name(recipeObj, typeList):
    recipeObj.mealTypes.all().delete()
    for each in typeList:
        mealType, created = MealType.objects.get_or_create(name=each)
        recipeObj.mealTypes.add(mealType)
        recipeObj.save()

# Save cuisines info of a recipe
def _save_cuisines_with_name(recipeObj, cuisineList):
    recipeObj.cuisines.all().delete()
    for each in cuisineList:
        cuisine, created = Cuisine.objects.get_or_create(name=each)
        recipeObj.cuisines.add(cuisine)
        recipeObj.save()

@transaction.atomic
def _save_ingredients_info(recipeObj, ingList):
    RecipeIngredient.objects.filter(recipe=recipeObj).delete()
    for eachIng in ingList:
        ingObj, ing_created = Ingredient.objects.get_or_create(name=eachIng['name'])
        quantity = eachIng['quantity'] if 'quantity' in eachIng and eachIng['quantity'] else None
        throughObj, through_created = RecipeIngredient.objects.get_or_create(
            recipe = recipeObj, 
            ingredient = ingObj,
        )

        if quantity != throughObj.quantity:
            throughObj.quantity = quantity
            throughObj.save()
    