from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User
from django.contrib.auth.hashers import check_password

# Override authenticate() method
# Allow validating users by email and password
class EmailBackend(ModelBackend):
    def authenticate(self, request, email=None, username=None, password=None, **kwargs):
        print('authenticate')
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return None
        else:
            if user.check_password(password):
                return user
        return None
    
    def get_user(self, user_id):
        print('run herre')
        try:
            return UserModel.objects.get(pk=user_id)
        except Exception as e:
            return None