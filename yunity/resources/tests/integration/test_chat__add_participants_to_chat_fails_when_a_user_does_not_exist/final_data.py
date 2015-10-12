from yunity.models import Chat

chat = Chat.objects.first()
assert chat.participants.count() == 2, "Participant are not supposed to change"