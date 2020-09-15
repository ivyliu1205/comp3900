from django.contrib.sessions.models import Session
from .models import *
import jwt

# Used to check a user is online or offline
#   Return UserObj, if online
#   Return None, if offline
def already_login(request):
    auth = request.headers.get('Authorization')
    if not auth:    return None

    sessionid = request.COOKIES.get('sessionid')
    userObj = None
    try:
        sessionObj = Session.objects.get(session_key=sessionid)
        uid = int(sessionObj.get_decoded().get('_auth_user_id'))
        userObj = User.objects.get(id=uid)
    except:
        return None

    return userObj

