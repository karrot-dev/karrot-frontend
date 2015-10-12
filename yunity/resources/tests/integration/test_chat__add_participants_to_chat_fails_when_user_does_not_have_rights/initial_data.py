from yunity.models import Chat, Message
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(5)
request_user = users[0]
initial_users = users[1:]

chat = Chat.objects.create()
chat.participants.add(*initial_users)

chatid = chat.id
number_of_initial_participants = chat.participants.count()

Message.objects.create(
    content="Hello group chat!",
    type="TEXT",
    sent_by=initial_users[0],
    in_conversation=chat
)
