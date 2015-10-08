from yunity.utils.factories import UserFactory

users = [
    UserFactory.create_safe(email="testuser1234@mail.com", display_name="I am the existing user"),
]
