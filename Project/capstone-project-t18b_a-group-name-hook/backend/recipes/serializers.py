from rest_framework import serializers
from .models import *

class CuisineSerializer(serializers.ModelSerializer):

    class Meta:
        model = Cuisine
        fields = "__all__"