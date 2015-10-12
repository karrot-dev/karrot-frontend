from yunity.models import Chat, Message
from yunity.utils.tests.mock import MockUser

initial_users = MockUser.create_batch(2)
request_user = initial_users[0]

chat = Chat.objects.create()
chat.participants.add(*initial_users)

Message.objects.create(
    content="Hello group chat!",
    type="TEXT",
    sent_by=initial_users[0],
    in_conversation=chat
)
