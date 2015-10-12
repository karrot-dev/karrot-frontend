from yunity.models import Chat
from .initial_data import chatid, number_of_initial_participants

assert Chat.objects.get(id=chatid).participants.count() == number_of_initial_participants, "Participant are not supposed to change"
