from dateutil.parser import parse
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.conversations.factories import ConversationFactory
from foodsaving.conversations.models import ConversationParticipant
from foodsaving.users.factories import UserFactory


class TestConversationsAPI(APITestCase):
    def setUp(self):
        self.participant1 = UserFactory()
        self.participant2 = UserFactory()
        self.participant3 = UserFactory()
        self.not_participant1 = UserFactory()
        self.not_participant2 = UserFactory()
        self.not_participant3 = UserFactory()
        self.conversation1 = ConversationFactory()
        self.conversation1.sync_users([
            self.participant1, self.participant2, self.participant3
        ])
        self.conversation1.messages.create(author=self.participant1, content='hello')
        self.conversation2 = ConversationFactory()
        self.conversation2.sync_users([
            self.participant1
        ])
        self.conversation2.messages.create(author=self.participant1, content='hello2')
        self.conversation3 = ConversationFactory()  # conversation noone is in

    def test_get_messages(self):
        self.client.force_login(user=self.participant1)
        response = self.client.get('/api/messages/?conversation={}'.format(self.conversation1.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['content'], 'hello')

    def test_can_get_messages_for_all_conversations(self):
        self.client.force_login(user=self.participant1)
        response = self.client.get('/api/messages/', format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)
        self.assertEqual(response.data['results'][0]['content'], 'hello2')
        self.assertEqual(response.data['results'][1]['content'], 'hello')

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
        self.assertEqual(conversation.messages.first().created_at, parse(response.data['created_at']), response.data)
        self.assertEqual(conversation.messages.first().id, response.data['id'])
        self.assertEqual(conversation.messages.first().author.id, response.data['author'])

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


class TestConversationsSeenUpToAPI(APITestCase):
    def setUp(self):
        self.conversation = ConversationFactory()
        self.user = UserFactory()
        self.conversation.join(self.user)
        self.participant = ConversationParticipant.objects.get(conversation=self.conversation, user=self.user)

    def test_conversation_get(self):
        message = self.conversation.messages.create(author=self.user, content='yay')
        self.client.force_login(user=self.user)

        response = self.client.get('/api/conversations/{}/'.format(self.conversation.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['seen_up_to'], None)
        self.assertEqual(response.data['unread_message_count'], 1)

        self.participant.seen_up_to = message
        self.participant.save()

        response = self.client.get('/api/conversations/{}/'.format(self.conversation.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['seen_up_to'], message.id)
        self.assertEqual(response.data['unread_message_count'], 0)

    def test_conversation_list(self):
        message = self.conversation.messages.create(author=self.user, content='yay')
        self.client.force_login(user=self.user)

        self.participant.seen_up_to = message
        self.participant.save()

        response = self.client.get('/api/conversations/'.format(self.conversation.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['seen_up_to'], message.id)

    def test_mark_seen_up_to(self):
        message = self.conversation.messages.create(author=self.user, content='yay')
        self.client.force_login(user=self.user)

        response = self.client.get('/api/conversations/{}/'.format(self.conversation.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['seen_up_to'], None)

        data = {'seen_up_to': message.id}
        response = self.client.post('/api/conversations/{}/mark/'.format(self.conversation.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['seen_up_to'], message.id)

        self.participant.refresh_from_db()
        self.assertEqual(self.participant.seen_up_to, message)

    def test_mark_seen_up_to_fails_for_invalid_id(self):
        self.client.force_login(user=self.user)
        data = {'seen_up_to': 9817298172}
        response = self.client.post('/api/conversations/{}/mark/'.format(self.conversation.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['seen_up_to'][0],
                         'Invalid pk "{}" - object does not exist.'.format(data['seen_up_to']))

    def test_mark_seen_up_to_fails_for_message_in_other_conversation(self):
        conversation = ConversationFactory()
        message = conversation.messages.create(author=self.user, content='yay')
        self.client.force_login(user=self.user)
        data = {'seen_up_to': message.id}
        response = self.client.post('/api/conversations/{}/mark/'.format(self.conversation.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['seen_up_to'][0], 'Must refer to a message in the conversation')
