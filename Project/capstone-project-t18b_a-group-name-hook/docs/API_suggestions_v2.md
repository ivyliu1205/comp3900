# Remark

1. For API with "require auth" == "Y", the client side may receive response with code 401 if no token is included in the request or the token is not accepted by the server (modified, expired or other reasons).

2. Error response status code
    - 401: Auth error
    - Others 4xx or 5xx: Server error

# Authentication format

### Primary:

- Token in cookies (purely handled by the server)

### Secondary:

 - http request header:
    - Authentication:`<TOKEN>`
    - where `<TOKEN>` is the authenication token supplied by the server
    - Guaranteed to be supplied to all the API requiring authentication
    - NOT guaranteed to be valid (must be validated by the server)

# APIs

## Exploration

1. Get all labels. (Cached on client side througout the app lifetime)

   - url: `labels/`
   - method: `GET`
   - require auth: `No`
   - request body: `None`
   - Remark:
     - Field "unit" can be anything as long as it is make sense. But the unit of the field "quantity" in request for "/recipes/" must be corresponding to the field "unit" in this response.
   - response body (`200`):

     ```json
     {
         "ingredients": {
             "meat / seafood": [
                 {
                     "name": "chicken",
                 },
                 ...

             ],
             "vegetables / fruits":[
                 {
                     "name": "onion",
                 },
                 ...
             ]
         },
         "cuisines": [
             {
                 "name": "Chinese",
             },
             {
                 "name": "Australian",
             },
             ...
         ],
         "mealTypes": [
             {
                 "name": "gluten free",
             },
             ...
         ],
         "utensils": [] // empty list
     }
     ```

1. Get matched recipes (If there is no label, return any recipes)

   - url: `recipes/`
   - method: `GET`(if request has no data) OR POST (if request has data)
   - require auth: `No`
   - request body: `None` OR
     - Barebone:
       ```json
       {
         "ingredients": [],
         "maxTime": null
       }
       ```
     - Typical
       `json { "ingredients": [ { "name": "INGREDIENT1", }, { "name": "INGREDIENT2", }, ], "maxTime": 30, }`
       Remark:
     - `"maxTime"` is in minutes, null if not specified.
   - response body (`200`):

     ```json
     {
         "recipes": [
             {
                 "own": true,
                 "id": 2231,
                 "creator": "CREATOR 1",  // can be null
                 "name": "Recipe 1",
                 "imgSrcs": ["cdn.com/recipe1_img1.png","cdn.com/recipe1_img2.png"],
                 "ingredients": [
                     {
                         "name": "INGREDIENT1",
                         "quantity": 300,
                         "unit": "gram",
                     },
                 ],
                 "time": null,
                 "cuisines": [
                     "CUISINE1","CUISINE2"
                 ],
                 "mealTypes": [
                     "MEALTYPE1"
                 ],
                 "utensils": [
                     "UTENSIL1"
                 ],

                 "steps": [
                     "Remove the bone from the chicken",
                     "Stir fry the chicken",
                 ]
             },

             {
                 "own": false,
                 "id": 	642041,
                 "creator": 0, // can be null
                 "name": "Easy Onion Cheese Rounds",
                 "imgSrcs": ["https://spoonacular.com/recipeImages/642041-556x370.jpg",],
                 ...
             },
         ],
         "suggestedIngredients": [
             "INGREDIENT1",
         ]
     }
     ```

     Remark:

     - values in `"suggestedIngredients"` are the ingredient names
     - `"time"` is in minutes, null if not specified.
     - `"creator"` is the name of the creator
     - `"own"` states whether the recipe belongs to our system

   - response body(`400`):

1. Get recipe details of ID

   - url: `recipes/<RECIPE_ID>`
   - method: `GET`
   - require auth: `No`
   - request body: `None`
   - response body (`200`):

     ```json
     {
       "own": true,
       "id": 2231,
       "creator": "CREATOR 1", // can be null
       "name": "Recipe 1",
       "imgSrcs": ["cdn.com/recipe1_img1.png", "cdn.com/recipe1_img2.png"],
       "ingredients": [
         {
           "id": "INGREDIENT1",
           "quantity": 300,
           "unit": "gram"
         }
       ],
       "time": null, // number
       "cuisines": ["CUISINE1", "CUISINE2"],
       "mealTypes": ["MEALTYPE1"],
       "utensils": ["UTENSIL1"],

       "steps": ["Remove the bone from the chicken", "Stir fry the chicken"]
     }
     ```

   - response body(`400`):

1. Get Creator details
   - url: `creators/<CREATOR_NAME>`
   - method: `GET`
   - require auth: `No`
   - request body: `None`
   - response body (`200`):
     ```json
     {
       "name": "<CREATOR_NAME>",
       "recipeIDs": [2231]
     }
     ```
   - response body(`400`): `None`

## User

1. Login user account

   - url: `users/login/`
   - method: `POST`
   - require auth: `No`
   - request body:
     ```json
     {
       "email": "EMAIL_ADDR@gmail.com", // must have
       "password": "325tgt3ji12j1" // must have
     }
     ```
   - response body (`200`):
     ```json
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     }
     ```
   - response body (`401`):
     ```json
     {
       "message": "credential not matched"
     }
     ```

1. Register user account
   - url: `users/register/`
   - method: `POST`
   - require auth: `No`
   - request body:
     ```json
     {
       "email": "EMAIL_ADDR@gmail.com", // must have
       "password": "325tgt3ji12j1" // must have
     }
     ```
   - response body (`200`):
     ```json
     {
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
     }
     ```
   - response body (`401`):

     ```json
     {
       "message": "Credential does not match the record"
     }
     ```
1. Get user's profile

   - url: `users/profile`
   - method: `GET`
   - require auth: `Yes`
   - request body: `None`
   - response body (`200`):
     ```json
     {
       "email": "EMAIL_ADDR@gmail.com" // must have
     }
     ```
   - response body (`400`):
     ```json
     {
       "message": "Cannot get user details"
     }
     ```

1. Change user's password

   - url: `users/profile/changePassword`
   - method: `POST`
   - require auth: `Yes`
   - request body:
     ```json
     {
       "oldPassword": "325tgt3ji12j1", // must have
       "newPassword": "NEW_PASSWORD" // must have
     }
     ```
   - response body (`200`): `None`
   - response body (`401`):
     ```json
     {
       "message": "Old password does not match the record"
     }
     ```

1. Refresh token

   - url: `users/refresh`
   - method: `POST`
   - require auth: `Yes`
   - request body: `None` (Use cookie for validation)
   - response body (`200`): `None`
   - response body (`401`): `None`

## Creator (Contributor) specific

1. Get all creator's own recipes

   - url: `creators/recipes/`
   - method: `GET`
   - require auth: `Yes`
   - request body: `None`
   - response body (`200`): `Similar to get matched recipes. One difference is that this has no "creatorId" field`

     ```json
     [
         {
             "id": 2231,
             "name": "Recipe 1",
             "imgSrcs": ["cdn.com/recipe1_img1.png","cdn.com/recipe1_img2.png"],
             "ingredients": [
                 {
                     "name": "INGREDIENT1",
                     "quantity": 300,
                     "unit": "gram",
                 },
             ],
             "time": null,
             "cuisines": [
                 "CUISINE1","CUISINE2"
             ],
             "mealTypes": [
                 "MEALTYPE1"
             ],
             "utensils": [
                 "UTENSIL1"
             ],

             "steps": [
                 "Remove the bone from the chicken",
                 "Stir fry the chicken",
             ]
         },

         {
             "id": 	642041,
             "name": "Easy Onion Cheese Rounds",
             "imgSrcs": ["https://spoonacular.com/recipeImages/642041-556x370.jpg",],
             ...
         },
     ],
     ```

   - response body (`400`):
     ```json
     {
       "message": "Fails to get recipes"
     }
     ```

1. Get creator's own recipe of ID

   - url: `creators/recipes/details/`
   - method: `POST`
   - require auth: `Yes`
   - request body:
     ```json
     {
       "id": 2231
     }
     ```
   - response body (`200`): **_On top of response body of 'recipes/<RECIPE_ID>', it has "public", "lastEdit" and "missingIngredients" field_**

     ```json
     {
       "id": 2231,
       "name": "Recipe 1",
       "imgSrcs": ["cdn.com/recipe1_img1.png", "cdn.com/recipe1_img2.png"],
       "ingredients": [
         {
           "name": "INGREDIENT1",
           "quantity": 300,
           "unit": "gram"
         }
       ],
       "time": null,
       "cuisines": ["CUISINE1", "CUISINE2"],
       "mealTypes": ["MEALTYPE1"],
       "utensils": ["UTENSIL1"],

       "steps": ["Remove the bone from the chicken", "Stir fry the chicken"]
     }
     ```

   - response body (`400`):
     ```json
     {
       "message": "Fails to get recipe"
     }
     ```

1. Edit recipe

   - url: `creators/recipes/edit/`
   - method: `POST`
   - require auth: `Yes`
   - request body: **_Except "id", all fields are optional. No value change occur on all the not included fields_**

     ```json
     {
       "id": 2231,
       "name": "Recipe 1",
       "imgSrcs": ["cdn.com/recipe1_img1.png", "cdn.com/recipe1_img2.png"],
       "ingredients": [
         {
           "name": "INGREDIENT1",
           "quantity": 300,
           "unit": "gram"
         }
       ],
       "time": null,
       "cuisines": ["CUISINE1", "CUISINE2"],
       "mealTypes": ["MEALTYPE1"],
       "utensils": ["UTENSIL1"],

       "steps": ["Remove the bone from the chicken", "Stir fry the chicken"]
     }
     ```

   - response body (`200`): **_Similar with request body, but contains all the fields plus the "lastEdit" field_**

     ```json
     {
       "id": 2231,
       "name": "Recipe 1",
       "imgSrcs": ["cdn.com/recipe1_img1.png", "cdn.com/recipe1_img2.png"],
       "ingredients": [
         {
           "name": "INGREDIENT1",
           "quantity": 300,
           "unit": "gram"
         }
       ],
       "time": null,
       "cuisines": ["CUISINE1", "CUISINE2"],
       "mealTypes": ["MEALTYPE1"],
       "utensils": ["UTENSIL1"],

       "steps": ["Remove the bone from the chicken", "Stir fry the chicken"]
     }
     ```

   - response body (`400`):
     ```json
     {
       "message": "Fails to edit recipe"
     }
     ```

1. Delete recipe

   - url: `creators/recipes/delete/`
   - method: `POST`
   - require auth: `Yes`
   - request body:
     ```json
     {
       "id": 2231
     }
     ```
   - response body (`200`): `None`
   - response body (`400`):d
     ```json
     {
       "message": "Fails to delete recipe"
     }
     ```

1. Upload image

   - url: `creators/recipes/images/update`
   - method: `POST`
   - require auth: `Yes`
   - headers: (Note that other headers has "Content-Type" set as "application/json")
     ```json
     {
       "Content-Type": "multipart/form-data"
     }
     ```
   - request body: FormData (Displayed in JSON For display purpose only. Keep in mind that JSON and Formdata are two different things. References are below)

     ```json
     [
         {
             "key": "id",
             "value": <RECIPE_ID>,
         }
         {
             "key": "newimage0",
             "value": <NEW_IMAGE_FILE_DATA_0>,
         },
         {
             "key": "newimage1",
             "value": <NEW_IMAGE_FILE_DATA_1>,
         },
         ...
         {
             "key": "deleteimage0",
             "value": <DELETE_IMAGE_SRC_0>,
         },
         {
             "key": "deleteimage1",
             "value": <DELETE_IMAGE_SRC_1>,
         },
         ...
     ]
     ```

     Remark:

     - keys:
       - `id`: Recipe ID
       - `newimageX`: `X`-th image to be added (`X` starts from 0)
       - `deleteimageX`: `X`-th image to be deleted (`X` starts from 0)
     - values:
       - `<RECIPE_ID>` is the ID of the recipe to which these new images are linked
       - `<NEW_IMAGE_FILE_DATA_X>` is the `X`-th image file content added to the recipe. It must be of type png or jpg.
       - `<DELETE_IMAGE_SRC_X>` is the image `X`-th image URL to be deleted from the recipe. The URLs are the ones provided by the server.

   - response body (`200`):

   ```json
   {
     "id": 2231,
     "name": "Recipe 1",
     "imgSrcs": ["cdn.com/recipe1_img1.png", "cdn.com/recipe1_img2.png"],
     "ingredients": [
       {
         "name": "INGREDIENT1",
         "quantity": 300,
         "unit": "gram"
       }
     ],
     "time": null,
     "cuisines": ["CUISINE1", "CUISINE2"],
     "mealTypes": ["MEALTYPE1"],
     "utensils": ["UTENSIL1"],

     "steps": ["Remove the bone from the chicken", "Stir fry the chicken"]
   }
   ```

   - response body (`400`):
     ```json
     {
       "message": "Fails to upload image"
     }
     ```
   - Remark:
     - Frontend reference: https://developer.mozilla.org/en-US/docs/Web/API/FormData
     - Backend reference: https://docs.djangoproject.com/en/3.0/topics/http/file-uploads/
