from yunity.models import Chat, Message
from yunity.utils.tests.mock import MockUser

chat_starter, chat_responder = MockUser.create_batch(2)

chat = Chat.objects.create()
chat.participants.add(chat_starter, chat_responder)

Message.objects.create(
    content="Hey, I created a chat",
    type="TEXT",
    sent_by=chat_starter,
    in_conversation=chat
)
