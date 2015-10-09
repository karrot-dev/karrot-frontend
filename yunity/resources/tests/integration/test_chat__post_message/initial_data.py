from yunity.models import Chat, Message
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(2)
request_user = users[0]

chat = Chat.objects.create()
chat.participants.add(*users)
chatid = chat.id

Message.objects.create(
    content="Hey, I created a chat",
    type="TEXT",
    sent_by=users[1],
    in_conversation=chat
)