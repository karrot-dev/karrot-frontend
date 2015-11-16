from yunity.models import Conversation, ConversationMessage
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(4)
request_user = users[0]
initial_users = users[:2]
add_users = users[2:]

chat = Conversation.objects.create()
chat.participants.add(*initial_users)

ConversationMessage.objects.create(
    content="Hello group chat!",
    sent_by=users[0],
    in_conversation=chat
)



