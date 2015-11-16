from yunity.models import Conversation
from .initial_data import chat, add_users, initial_users

num_chat_participants = Conversation.objects.get(id=chat.id).participants.count()
assert num_chat_participants == len(add_users) + len(initial_users), "Participants were not added"
