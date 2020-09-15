from django.urls import include, path
from django.conf.urls import url
from .views import *

# creator/

urlpatterns = [
        path('recipes/', created_recipes),
        path('recipes/details/', recipe_details),
        path('recipes/edit/', edit_recipe),
        path('recipes/delete/', delete_recipe),
        path('<int:creator_id>/', creators_recipes),
        path('recipes/images/update', edit_image)
]