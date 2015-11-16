from yunity.models import Conversation, ConversationMessage
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(2)
request_user = users[0]

chat = Conversation.objects.create()
chat.participants.add(*users)

chatid = chat.id

ConversationMessage.objects.create(
    content="Hello Matthias!",
    type="TEXT",
    sent_by=users[0],
    in_conversation=chat
)

ConversationMessage.objects.create(
    content="Hi Tilmann! How are you?",
    type="TEXT",
    sent_by=users[1],
    in_conversation=chat
)



