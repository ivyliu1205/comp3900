from django.test import TestCase, Client
from .models import search, Ingredient, get_random_recipes
import json


## Test1: search recipes by ingredients
class SearchTest(TestCase):
    # initialize the Django test client
    def setUp(self):
        self.c = Client()

    # this response should be empty, coz we want GET request
    def test_with_post(self):
        data = {
            "ingredients": [
                {
                    "id": 1,
                    "quantity": 2,
                },
                {
                    "id": 445,
                    "quantity": 3,
                },
            ],
            "maxTime": 30, 
            "cuisines": [  
                2001,2002
            ],
            "mealTypes": [],
            "utensils": []
        }
        # print(json.dumps(data))
        response = self.c.post('/recipes/', data)
        # print('response={}'.format(response.content))
        print('Test with POST = {}'.format(response.content))

    # def test_with_get(self):
    #     response = self.c.get('/recipes')
    #     # print('response={}'.format(response.content))
    #     print('Test with GET = {}'.format(response.content))

## Test2: show all labels
# class LabelTest(TestCase):
#     def setUp(self):
#         self.c = Client()

#     # def insertTestData(self):
#     #     data = {"ingredients": [{"name": "milk"}, {"name": "egg"}, {"name": "flour"}, {"name": "chicken"}]}
#     #     Ingredient.objects.create(**data)
#     #     print('#Ingredient = {}'.format(Ingredient.objects.all().count()))

#     def test_with_get(self):
#         response = self.c.get('/labels')
#         print('GET labels = {}'.format(response.content))