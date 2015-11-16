from yunity.models import Conversation, ConversationMessage
from yunity.utils.tests.mock import MockUser

initial_users = MockUser.create_batch(2)
request_user = initial_users[0]

chat = Conversation.objects.create()
chat.participants.add(*initial_users)

ConversationMessage.objects.create(
    content="Hello group chat!",
    sent_by=initial_users[0],
    in_conversation=chat
)
