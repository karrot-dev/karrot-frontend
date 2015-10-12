from yunity.models import Chat
from .initial_data import chatid, original_number_of_participants

chat = Chat.objects.get(id=chatid)
assert chat.participants.count() == original_number_of_participants - 1, "Participant was not deleted"
