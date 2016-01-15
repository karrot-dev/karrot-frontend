from yunity.conversations.models import ConversationMessage, Conversation
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(3)
request_user = users[0]
initial_users = users[:2]

chat = Conversation.objects.create()
chat.participants.add(*initial_users)
chat.name = "initial unrelated name"
chat.save()
chatid = chat.id

initial_message = ConversationMessage.objects.create(
    content="Hello group chat!",
    sent_by=users[0],
    in_conversation=chat
)



