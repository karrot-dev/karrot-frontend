from yunity.conversations.models import Conversation

chat = Conversation.objects.first()
assert chat.name == "New funny name", "Chat rename not in database"
