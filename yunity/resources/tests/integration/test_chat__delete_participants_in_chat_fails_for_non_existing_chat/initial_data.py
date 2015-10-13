from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(3)
request_user = users[0]
user_to_delete = users[2]
