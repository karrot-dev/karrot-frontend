from yunity.models import Chat
from .initial_data import chat, initial_users

num_chat_participants = Chat.objects.get(id=chat.id).participants.count()
assert num_chat_participants == len(initial_users), "Participant are not supposed to change"
