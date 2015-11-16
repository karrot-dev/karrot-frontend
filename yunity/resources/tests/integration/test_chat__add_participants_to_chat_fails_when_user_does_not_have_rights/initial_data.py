from yunity.models import Conversation, ConversationMessage
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(5)
request_user = users[0]
initial_users = users[1:]

chat = Conversation.objects.create()
chat.participants.add(*initial_users)

ConversationMessage.objects.create(
    content="Hello group chat!",
    sent_by=initial_users[0],
    in_conversation=chat
)
