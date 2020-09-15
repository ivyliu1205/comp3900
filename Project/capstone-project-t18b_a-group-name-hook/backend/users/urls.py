from django.urls import include, path
from django.conf.urls import url
from django.views.decorators.csrf import csrf_exempt
from .views import *

# users/

urlpatterns = [
    path('register/', csrf_exempt(register), name='register'),
    path('login/', csrf_exempt(login_view), name='login'),
    # path('logout/', logout_view, name='logout'),
    path('refresh/', csrf_exempt(validate)),
    path('profile/', profile, name='profile'),
    path('profile/changePassword/', csrf_exempt(changePassword), name='changePassword'),
]