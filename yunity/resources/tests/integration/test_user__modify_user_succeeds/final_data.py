from django.contrib.auth import get_user_model
from .initial_data import request_user
from .request import request

UserModel = get_user_model()
user = UserModel.objects.get(id=request_user)

assert user.display_name == request['body']['display_name'], 'User display_name did not get modified'
