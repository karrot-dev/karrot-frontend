from yunity.utils.factories import UserFactory

users = UserFactory.create_batch_safe(2)
request_user = users[0]
