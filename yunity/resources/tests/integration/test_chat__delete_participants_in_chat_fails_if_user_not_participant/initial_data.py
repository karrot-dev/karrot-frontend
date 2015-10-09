from yunity.models import Chat, Message
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(4)
request_user = users[0]
user_to_delete = users[2]

chat = Chat.objects.create()
chat.participants.add(*users[1:4])
chatid = chat.id

Message.objects.create(
    content="Hello Matthias!",
    type="TEXT",
    sent_by=users[0],
    in_conversation=chat
)

Message.objects.create(
    content="Hi Tilmann! How are you?",
    type="TEXT",
    sent_by=users[1],
    in_conversation=chat
)



