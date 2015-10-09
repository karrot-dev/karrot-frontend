from yunity.utils.tests.factory import UserFactory

users = UserFactory.create_batch(2)
request_user = users[0]
