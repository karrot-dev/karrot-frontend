from yunity.models import Chat, Message
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(2)
request_user = users[0]
initial_users = users

chat = Chat.objects.create()
chat.participants.add(*initial_users)
chatid = chat.id

Message.objects.create(
    content="Hello group chat!",
    type="TEXT",
    sent_by=users[0],
    in_conversation=chat
)



