from yunity.utils.factories import UserFactory

user1 = UserFactory.create(email="testuser1@mail.com",
                   display_name="Testuser1")
assert user1.id == 13, "User ID is not as expected by test framework: %i vs %i" %(13, user1.id)

user2 = UserFactory.create(email="testuser2@mail.com",
                   display_name="Testuser2")
assert user2.id == 14, "User ID is not as expected by test framework: %i vs %i" %(14, user2.id)
