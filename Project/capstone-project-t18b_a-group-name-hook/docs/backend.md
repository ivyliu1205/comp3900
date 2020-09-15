# BACKEND
[Click to return main page :)](../README.md)

## Explanation about some method

### Recipes
#### Views
#### Models
- **save_recipe_into_response(dataList, recipeObj, *argv):**  

    This function is used to extract the following data from a recipe object and save them into a list(dataList).  

            'id', 'creatorId', 'name',   
            'imgSrcs', 'ingredients',  
            'time', 'cuisines', 'mealTypes', 
            'utensils', 'steps'  
    
    If you need extra data, please transfer then through ***argv**.  

    For example,
    
        dataList = []
        recipeObj = Recipe.objects.get(id=1)
        save_recipe_into_response(dataList, recipeObj)
            #dataList = {
            #    'id': XX,
            #    'creatorId': XX,
            #    'name': XXXXX,
            #    'imgSrcs': [XX],
            #    'ingredients': [XX],
            #    'time': XXX,
            #    'cuisines': [XXXX],
            #    'mealTypes': [XXXX],
            #    'utensils': [XXXX],
            #    'steps': [XXXX, XXXX]
            #}

    If I need **'own'**, I will call **save_recipe_into_response(dataList, recipeObj, 'own')**  

### Users

### Creators

## Run the project

    python3 manage.py runserver

## Create new app

    cd Apps  
    django-admin startapp APP_NAME

## Manage as a super administor ( /admin )

-   Username: admin  
-   Email: super@admin.com
-   Password: 123456