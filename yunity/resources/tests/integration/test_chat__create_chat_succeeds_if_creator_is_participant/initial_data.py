from yunity.utils.factories import UserFactory

users = UserFactory.create_batch(2)
request_user = users[0]
