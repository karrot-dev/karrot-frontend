from yunity.conversations.models import ConversationMessage, ConversationType, Conversation
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(2)
request_user = users[0]

chat = Conversation.objects.create(type=ConversationType.USER_MULTICHAT)
chat.participants.add(*users)

chatid = chat.id

ConversationMessage.objects.create(
    content="Hello Matthias!",
    sent_by=users[0],
    in_conversation=chat
)

ConversationMessage.objects.create(
    content="Hi Tilmann! How are you?",
    sent_by=users[1],
    in_conversation=chat
)



