from yunity.models import ConversationType
from yunity.utils.tests.mock import MockUser, MockConversation

users = MockUser.create_batch(3)
request_user = users[0]
user_to_delete = users[2]

chat = MockConversation.create(participants=users, type=ConversationType.USER_MULTICHAT)
