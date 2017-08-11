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
        cls.conversation2 = ConversationFactory()
        cls.conversation2.sync_users([
            cls.participant1
        ])
        cls.conversation2.messages.create(author=cls.participant1, content='hello2')
        cls.conversation3 = ConversationFactory()  # conversation noone is in

    def test_get_messages(self):
        self.client.force_login(user=self.participant1)
        response = self.client.get('/api/messages/?conversation={}'.format(self.conversation1.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['content'], 'hello')

    def test_can_get_messages_for_all_conversations(self):
        self.client.force_login(user=self.participant1)
        response = self.client.get('/api/messages/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['content'], 'hello')
        self.assertEqual(response.data[1]['content'], 'hello2')

    def test_cannot_get_messages_if_not_in_conversation(self):
        self.client.force_login(user=self.participant1)
        response = self.client.get('/api/messages/?conversation={}'.format(self.conversation3.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_same_error_if_conversation_does_not_exist_as_if_you_are_just_not_in_it(self):
        self.client.force_login(user=self.participant1)
        response = self.client.get('/api/messages/?conversation={}'.format(982398723), format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_message(self):
        conversation = ConversationFactory()
        conversation.join(self.participant1)
        self.client.force_login(user=self.participant1)
        data = {'conversation': conversation.id, 'content': 'a nice message'}
        response = self.client.post('/api/messages/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        self.assertEqual(response.data['content'], data['content'])
        self.assertEqual(conversation.messages.first().content, data['content'])

    def test_cannot_create_message_without_specifying_conversation(self):
        self.client.force_login(user=self.participant1)
        data = {'content': 'a nice message'}
        response = self.client.post('/api/messages/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_create_message_if_not_in_conversation(self):
        self.client.force_login(user=self.participant1)
        data = {'conversation': self.conversation3.id, 'content': 'a nice message'}
        response = self.client.post('/api/messages/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
