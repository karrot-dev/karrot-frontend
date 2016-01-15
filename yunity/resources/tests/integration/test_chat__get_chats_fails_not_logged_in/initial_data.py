from yunity.conversations.models import ConversationMessage, Conversation
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(3)
request_user = users[0]

chat1 = Conversation.objects.create()
chat1.participants.add(*users)
chat1.name = "My little group chat"
chat1.save()

ConversationMessage.objects.create(
    content="Hey, I created a group chat",
    sent_by=users[0],
    in_conversation=chat1
)

ConversationMessage.objects.create(
    content="Thanks, how are you two?",
    sent_by=users[1],
    in_conversation=chat1
)

chat2 = Conversation.objects.create()
chat2.participants.add(users[0], users[1])

ConversationMessage.objects.create(
    content="Hello user 1",
    sent_by=users[0],
    in_conversation=chat2
)

chat3 = Conversation.objects.create()
chat3.participants.add(users[2], users[1])

ConversationMessage.objects.create(
    content="Unrelated stuff",
    sent_by=users[2],
    in_conversation=chat3
)



