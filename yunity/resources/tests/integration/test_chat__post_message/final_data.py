from yunity.conversations.models import ConversationMessage
from .initial_data import chat

messages_in_conversation = ConversationMessage.objects.filter(in_conversation=chat).count()
assert messages_in_conversation == 2, "message was not created"
