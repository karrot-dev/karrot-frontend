import json

import requests_mock
from channels.test import ChannelTestCase, WSClient
from pyfcm.baseapi import BaseAPI as FCMAPI

from foodsaving.conversations.factories import ConversationFactory
from foodsaving.conversations.models import ConversationMessage
from foodsaving.subscriptions.models import PushSubscriptionPlatform, PushSubscription
from foodsaving.users.factories import UserFactory
from foodsaving.utils.tests.fake import faker


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

    @requests_mock.Mocker()
    def test_sends_to_push_subscribers(self, m):

        def check_json_data(request):
            data = json.loads(request.body.decode('utf-8'))
            self.assertEqual(data['notification']['title'], content)
            self.assertEqual(data['to'], token)
            return True

        m.post(FCMAPI.FCM_END_POINT, json={}, additional_matcher=check_json_data)

        user = UserFactory()
        author = UserFactory()

        token = faker.uuid4()
        content = 'woo'

        # join a conversation
        conversation = ConversationFactory()
        conversation.join(user)
        conversation.join(author)

        # add a push subscriber
        PushSubscription.objects.create(user=user, token=token, platform=PushSubscriptionPlatform.ANDROID)

        # add a message to the conversation
        ConversationMessage.objects.create(conversation=conversation, content=content, author=author)

        # we can't check it was received but the check_json_data above will at least check it sent the right info

