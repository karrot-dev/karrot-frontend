from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.conversations.factories import Conversation
from foodsaving.users.factories import UserFactory
from foodsaving.utils.tests.fake import faker


class TestConversationsAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/conversations/'

        # A chat with 2 participants
        cls.participant = UserFactory()
        cls.participant2 = UserFactory()
        cls.conversation = Conversation(participants=[cls.participant, cls.participant2])
        cls.conversation_url = cls.url + str(cls.conversation.id) + '/'

        # not a participant
        cls.user = UserFactory()

        # another chat
        cls.conversation_data = {'topic': faker.name(),
                                 'with_participants': [cls.participant2.id, ],
                                 'message': faker.text()}
        cls.patch_data = {'topic': 'new topic'}
        cls.put_data = {'topic': 'new topic'}

    def test_create_conversation(self):
        response = self.client.post(self.url, self.conversation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_conversation_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url, self.conversation_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_conversations(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_conversations_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_list_conversations_as_participant(self):
        self.client.force_login(user=self.participant)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_conversations(self):
        response = self.client.get(self.conversation_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_conversations_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.conversation_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_conversations_as_participant(self):
        self.client.force_login(user=self.participant)
        response = self.client.get(self.conversation_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_conversation(self):
        response = self.client.patch(self.conversation_url, self.patch_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_conversation_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.patch(self.conversation_url, self.patch_data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_conversation_as_participant(self):
        self.client.force_login(user=self.participant)
        response = self.client.patch(self.conversation_url, self.patch_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_conversation(self):
        response = self.client.put(self.conversation_url, self.put_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_put_conversation_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.put(self.conversation_url, self.put_data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_put_conversation_as_participant(self):
        self.client.force_login(user=self.participant)
        response = self.client.put(self.conversation_url, self.put_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_conversation(self):
        response = self.client.delete(self.conversation_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_conversation_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.delete(self.conversation_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_delete_conversation_as_participant(self):
        self.client.force_login(user=self.participant)
        response = self.client.delete(self.conversation_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
