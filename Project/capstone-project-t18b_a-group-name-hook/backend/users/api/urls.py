from django.urls import path
from users.api.views import(
	register_view,
)

from rest_framework.authtoken.views import obtain_auth_token

app_name = 'account'

urlpatterns = [
	path('register', register_view, name="register"),
	path('login', obtain_auth_token, name="login"), 
]
