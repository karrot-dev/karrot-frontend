from channels.test import ChannelTestCase, WSClient

from foodsaving.conversations.factories import ConversationFactory
from foodsaving.conversations.models import ConversationMessage
from foodsaving.users.factories import UserFactory


class ReceiverTests(ChannelTestCase):
    def test_receives_messages(self):
        client = WSClient()
        user = UserFactory()
        author = UserFactory()

        # join a conversation
        conversation = ConversationFactory()
        conversation.join(user)
        conversation.join(author)

        # login and connect
        client.force_login(user)
        client.send_and_consume('websocket.connect', path='/')

        # add a message to the conversation
        message = ConversationMessage.objects.create(conversation=conversation, content='yay', author=author)

        # hopefully they receive it!
        self.assertEqual(client.receive(json=True), {
            'topic': 'conversations:message',
            'payload': {
                'id': message.id,
                'content': message.content,
                'author': message.author.id,
                'conversation': {
                    'id': conversation.id
                }
            }
        })

    def tests_receive_message_on_leave(self):
        client = WSClient()
        user = UserFactory()

        # join a conversation
        conversation = ConversationFactory()
        conversation.join(user)

        # login and connect
        client.force_login(user)
        client.send_and_consume('websocket.connect', path='/')

        conversation.leave(user)

        self.assertEqual(client.receive(json=True), {
            'topic': 'conversations:leave',
            'payload': {
                'id': conversation.id
            }
        })
