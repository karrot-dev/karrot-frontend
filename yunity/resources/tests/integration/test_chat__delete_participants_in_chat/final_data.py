from yunity.models import Chat
from .initial_data import chatid

chat = Chat.objects.get(id=chatid)
assert chat.participants.count() == 2, "Participant was not deleted"
