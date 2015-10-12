from yunity.models import Chat, Message
from yunity.utils.tests.mock import MockUser

sender, request_user = MockUser.create_batch(2)

chat = Chat.objects.create()
chat.participants.add(sender, request_user)
chatid = chat.id

messages = [
    Message.objects.create(
        content="This is message {}".format(i),
        type="TEXT",
        sent_by=sender,
        in_conversation=chat
    ) for i in range(10)
]

split = 6
before_messages = messages[:split]
the_message = messages[split]
after_messages = messages[split + 1:]
