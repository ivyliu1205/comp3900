import requests
from typing import Dict, Any
# use your own api key
SPOONACULAR_API_KEY = '476b4177d6064b758407cebe37c7ba70'

# Get data from Spoonacular


class SpoonacularData():

    def __init__(self):
        self.params = {'apiKey': SPOONACULAR_API_KEY}

    def get_random_recipes_from_spoonacular(self, number=5, **kwargs) -> Dict[str, Any]:
        self.params['number'] = str(number)
        r = requests.get(
            'https://api.spoonacular.com/recipes/random', self.params)
        r.raise_for_status()
        return r.json()

    def get_ingredient_info_from_spoonacular(self, ingredient_id, **kwargs) -> Dict[str, Any]:
        r = requests.get(
            'https://api.spoonacular.com/food/ingredients/{id}/information'.format(id=ingredient_id), self.params)
        r.raise_for_status()
        return r.json()

    def get_equipment_info_from_spoonacular(self, recipe_id, **kwargs) -> Dict[str, Any]:
        r = requests.get(
            'https://api.spoonacular.com/recipes/{id}/equipmentWidget.json'.format(id=recipe_id), self.params)
        r.raise_for_status()
        return r.json()

    def get_analyzed_recipe_info_from_spoonacular(self, recipe_id, **kwargs) -> Dict[str, Any]:
        r = requests.get(
            'https://api.spoonacular.com/recipes/{id}/analyzedInstructions'.format(id=recipe_id), self.params)
        r.raise_for_status()
        return r.json()

    def get_recipe_info_from_spoonacular(self, recipe_id, **kwargs) -> Dict[str, Any]:
        r = requests.get(
            'https://api.spoonacular.com/recipes/{id}/information'.format(id=recipe_id), self.params)
        r.raise_for_status()
        return r.json()
