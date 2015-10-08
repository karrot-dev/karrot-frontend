from django.contrib.auth import get_user_model

user = get_user_model().objects.filter(email="testuser1234@mail.com")
assert len(user) == 1, "No user found"

display_name = user.first().display_name
assert display_name == "I am the existing user", "User name altered"
