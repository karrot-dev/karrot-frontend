from yunity.conversations.models import ConversationMessage, Conversation
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(3)
request_user = users[2]

chat = Conversation.objects.create()
chat.participants.add(users[0], users[1])
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



