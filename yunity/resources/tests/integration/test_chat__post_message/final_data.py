from .initial_data import chat
from yunity.models import Message

messages_in_conversation = Message.objects.filter(in_conversation=chat).count()
assert messages_in_conversation == 2, "message was not created"
