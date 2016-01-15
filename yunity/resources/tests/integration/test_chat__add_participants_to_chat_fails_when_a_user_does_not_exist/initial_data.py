from yunity.conversations.models import ConversationMessage, ConversationType, Conversation
from yunity.utils.tests.mock import MockUser

initial_users = MockUser.create_batch(2)
request_user = initial_users[0]

chat = Conversation.objects.create(type=ConversationType.USER_MULTICHAT)
chat.participants.add(*initial_users)

ConversationMessage.objects.create(
    content="Hello group chat!",
    sent_by=initial_users[0],
    in_conversation=chat
)
