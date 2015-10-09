from yunity.models import Chat, Message
from yunity.utils.tests.mock import MockUser

users = MockUser.create_batch(3)
request_user = users[0]

chat1 = Chat.objects.create()
chat1.participants.add(*users)
chat1.name = "My little group chat"
chat1.save()

Message.objects.create(
    content="Hey, I created a group chat",
    type="TEXT",
    sent_by=users[0],
    in_conversation=chat1
)

Message.objects.create(
    content="Thanks, how are you two?",
    type="TEXT",
    sent_by=users[1],
    in_conversation=chat1
)

chat2 = Chat.objects.create()
chat2.participants.add(users[0], users[1])

Message.objects.create(
    content="Hello user 1",
    type="TEXT",
    sent_by=users[0],
    in_conversation=chat2
)

chat3 = Chat.objects.create()
chat3.participants.add(users[2], users[1])

Message.objects.create(
    content="Unrelated stuff",
    type="TEXT",
    sent_by=users[2],
    in_conversation=chat3
)



