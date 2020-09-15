from django.urls import include, path
from django.contrib.auth import views as auth_views
from django.conf.urls import url
from .views import *
from rest_framework import routers
from users import views as user_views

urlpatterns = [
        path('labels/', get_labels),
        path('recipes/', get_matched_recipes),
        path('recipes/<int:recipe_id>', get_recipe_details)
]
