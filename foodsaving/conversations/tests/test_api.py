from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.conversations.factories import ConversationFactory
from foodsaving.users.factories import UserFactory


class TestConversationsAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.participant1 = UserFactory()
        cls.participant2 = UserFactory()
        cls.participant3 = UserFactory()
        cls.not_participant1 = UserFactory()
        cls.not_participant2 = UserFactory()
        cls.not_participant3 = UserFactory()
        cls.conversation1 = ConversationFactory()
        cls.conversation1.sync_users([
            cls.participant1, cls.participant2, cls.participant3
        ])
        cls.conversation1.messages.create(author=cls.participant1, content='hello')
        cls.conversation2 = ConversationFactory()  # conversation noone is in

    def test_get_messages(self):
        self.client.force_login(user=self.participant1)
        response = self.client.get('/api/messages/?conversation={}'.format(self.conversation1.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], 'hello')
