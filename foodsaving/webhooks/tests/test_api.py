from base64 import b64encode

from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.conversations.factories import ConversationFactory
from foodsaving.users.factories import UserFactory
from foodsaving.webhooks.api import make_local_part
from foodsaving.webhooks.models import EmailEvent


class TestEmailReplyAPI(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.conversation = ConversationFactory()
        self.conversation.join(self.user)

    @override_settings(SPARKPOST_RELAY_SECRET='test_key')
    def test_receive_incoming_email(self):
        reply_token = make_local_part(self.conversation, self.user)
        response = self.client.post(
            '/api/webhooks/incoming_email/',
            data=[{'msys': {'relay_message': {
                'rcpt_to': '{}@example.com'.format(reply_token),
                'content': {'text': 'message body'}
            }}}],
            HTTP_X_MESSAGESYSTEMS_WEBHOOK_TOKEN='test_key',
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(self.conversation.messages.count(), 1)


class TestEmailEventAPI(APITestCase):

    @override_settings(SPARKPOST_WEBHOOK_SECRET='test_key')
    def test_receive_incoming_email(self):
        basic_auth = 'basic {}'.format(b64encode('asdf:test_key'.encode()).decode())
        response = self.client.post(
            '/api/webhooks/email_event/',
            data=[{'msys': {'message_event': {
                'event_id': 4,
                'type': 'bounce',
                'rcpt_to': 'spam@example.com'
            }}}],
            HTTP_AUTHORIZATION=basic_auth,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        event = EmailEvent.objects.first()
        self.assertEqual(event.address, 'spam@example.com')
        self.assertEqual(event.event, 'bounce')

