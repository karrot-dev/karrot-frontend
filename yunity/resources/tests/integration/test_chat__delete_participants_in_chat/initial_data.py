from yunity.models import Conversation, ConversationMessage, ConversationType
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(3)
request_user = users[0]
user_to_delete = users[2]

chat = Conversation.objects.create(type=ConversationType.USER_MULTICHAT)
chat.participants.add(*users)

chatid = chat.id
original_number_of_participants = chat.participants.count()

ConversationMessage.objects.create(
    content="Hello Matthias!",
    sent_by=users[0],
    in_conversation=chat
)

ConversationMessage.objects.create(
    content="Hi Tilmann! How are you?",
    sent_by=users[1],
    in_conversation=chat
)



