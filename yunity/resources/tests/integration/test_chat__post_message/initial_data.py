from yunity.models import Conversation, ConversationMessage
from yunity.utils.tests.mock import MockUser

chat_starter, chat_responder = MockUser.create_batch(2)

chat = Conversation.objects.create()
chat.participants.add(chat_starter, chat_responder)

ConversationMessage.objects.create(
    content="Hey, I created a chat",
    sent_by=chat_starter,
    in_conversation=chat
)
