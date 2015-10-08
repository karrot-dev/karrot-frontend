from yunity.utils.factories import UserFactory

users = [
    UserFactory.create(email="testuser1@mail.com", display_name="Testuser1"),
    UserFactory.create(email="testuser2@mail.com", display_name="Testuser2"),
]
