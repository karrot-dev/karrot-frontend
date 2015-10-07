from yunity.utils.factories import UserFactory

users = UserFactory.create_batch_with_ids(num_instances=1, id_start=1000)
request_user = users[0]
