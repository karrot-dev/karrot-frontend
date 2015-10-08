from django.contrib.auth import get_user_model

UserModel = get_user_model()
user = UserModel.objects.filter(email="testuser1234@mail.com")
assert user.exists() == True, "User does not exist"