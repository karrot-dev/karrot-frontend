from yunity.models import Conversation, ConversationMessage
from yunity.utils.tests.mock import MockUser

sender, request_user = MockUser.create_batch(2)

chat = Conversation.objects.create()
chat.participants.add(sender, request_user)
chatid = chat.id

messages = [
    ConversationMessage.objects.create(
        content="This is message {}".format(i),
        sent_by=sender,
        in_conversation=chat
    ) for i in range(10)
    ]

split = 6
before_messages = messages[:split]
the_message = messages[split]
after_messages = messages[split + 1:]
