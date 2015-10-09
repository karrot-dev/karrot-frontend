from yunity.models import Chat

chat = Chat.objects.first()
assert chat.participants.count() == 4, "Participants were not added"