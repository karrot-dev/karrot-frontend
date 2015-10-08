from yunity.utils.factories import UserFactory

users = [
    UserFactory.create_safe(email="testuser1@mail.com", display_name="Testuser1"),
    UserFactory.create_safe(email="testuser2@mail.com", display_name="Testuser2"),
]
