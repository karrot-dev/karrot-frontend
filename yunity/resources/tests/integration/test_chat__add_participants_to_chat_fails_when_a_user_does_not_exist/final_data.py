from yunity.conversations.models import Conversation
from .initial_data import chat, initial_users

num_chat_participants = Conversation.objects.get(id=chat.id).participants.count()
assert num_chat_participants == len(initial_users), "Participant are not supposed to change"
