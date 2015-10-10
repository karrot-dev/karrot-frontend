from django.contrib.auth import get_user_model
from .initial_data import users
from .request import request

UserModel = get_user_model()
user = UserModel.objects.get(id=users[1].id)

assert user.display_name != request['body']['display_name'], 'User display_name unexpectedly got modified'
