from yunity.models import Chat, Message
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(4)
request_user = users[0]
initial_users = users[:2]
add_users = users[2:]

chat = Chat.objects.create()
chat.participants.add(*initial_users)

Message.objects.create(
    content="Hello group chat!",
    type="TEXT",
    sent_by=users[0],
    in_conversation=chat
)



