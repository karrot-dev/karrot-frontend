from yunity.models import Chat

chat = Chat.objects.first()
assert chat.name == "New funny name", "Chat rename not in database"