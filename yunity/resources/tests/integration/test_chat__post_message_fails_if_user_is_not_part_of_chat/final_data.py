from .initial_data import chat
from yunity.models import ConversationMessage

messages_in_conversation = ConversationMessage.objects.filter(in_conversation=chat).count()
assert messages_in_conversation == 1, "message was created"
