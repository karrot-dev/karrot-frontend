from django.contrib.auth import get_user_model

from .initial_data import user
from .request import request

UserModel = get_user_model()
user = UserModel.objects.get(id=user.id)

assert user.display_name == request['body']['display_name'], 'User display_name did not get modified'
