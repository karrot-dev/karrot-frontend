from dateutil.parser import parse
from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.conversations.factories import ConversationFactory
from foodsaving.conversations.models import ConversationParticipant, Conversation, ConversationMessage
from foodsaving.groups.factories import GroupFactory
from foodsaving.users.factories import UserFactory, VerifiedUserFactory
from foodsaving.webhooks.models import EmailEvent


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
        self.user2 = UserFactory()
        self.conversation.join(self.user)
        self.conversation.join(self.user2)
        self.participant = ConversationParticipant.objects.get(conversation=self.conversation, user=self.user)

    def test_message_marked_seen_for_author(self):
        message = self.conversation.messages.create(author=self.user, content='yay')
        self.client.force_login(user=self.user)

        response = self.client.get('/api/conversations/{}/'.format(self.conversation.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['seen_up_to'], message.id)
        self.assertEqual(response.data['unread_message_count'], 0)

    def test_conversation_get(self):
        message = self.conversation.messages.create(author=self.user2, content='yay')
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
        message = self.conversation.messages.create(author=self.user2, content='yay')
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
        conversation.join(self.user)
        message = conversation.messages.create(author=self.user, content='yay')
        self.client.force_login(user=self.user)

        data = {'seen_up_to': message.id}
        response = self.client.post('/api/conversations/{}/mark/'.format(self.conversation.id), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['seen_up_to'][0], 'Must refer to a message in the conversation')


class TestConversationsEmailNotificationsAPI(APITestCase):
    def setUp(self):
        self.user = VerifiedUserFactory()
        self.group = GroupFactory(members=[self.user])
        self.conversation = self.group.conversation
        self.participant = ConversationParticipant.objects.get(conversation=self.conversation, user=self.user)

    def test_disable_email_notifications(self):
        participant = ConversationParticipant.objects.get(conversation=self.conversation, user=self.user)
        self.assertTrue(participant.email_notifications)

        self.client.force_login(user=self.user)

        data = {'email_notifications': False}
        response = self.client.post(
            '/api/conversations/{}/email_notifications/'.format(self.conversation.id),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email_notifications'], False)

        participant.refresh_from_db()
        self.assertFalse(participant.email_notifications)

    def test_enable_email_notifications(self):
        participant = ConversationParticipant.objects.get(conversation=self.conversation, user=self.user)
        participant.email_notifications = False
        participant.save()
        self.assertFalse(participant.email_notifications)

        self.client.force_login(user=self.user)

        data = {'email_notifications': True}
        response = self.client.post(
            '/api/conversations/{}/email_notifications/'.format(self.conversation.id),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email_notifications'], True)

        participant.refresh_from_db()
        self.assertTrue(participant.email_notifications)

    def test_send_email_notifications(self):
        users = [VerifiedUserFactory() for _ in range(3)]
        [self.group.add_member(u) for u in users]

        mail.outbox = []
        ConversationMessage.objects.create(author=self.user, conversation=self.conversation, content='asdf')

        actual_recipients = set(m.to[0] for m in mail.outbox)
        expected_recipients = set(u.email for u in users)

        self.assertEqual(actual_recipients, expected_recipients)

        self.assertEqual(len(mail.outbox), 3)

    def test_exclude_bounced_addresses(self):
        bounce_user = VerifiedUserFactory()
        self.conversation.join(bounce_user)
        EmailEvent.objects.create(address=bounce_user.email, event='bounce', payload={})

        mail.outbox = []
        ConversationMessage.objects.create(author=self.user, conversation=self.conversation, content='asdf')
        self.assertEqual(len(mail.outbox), 0)

    def test_exclude_unverified_addresses(self):
        user = UserFactory()
        self.conversation.join(user)

        mail.outbox = []
        ConversationMessage.objects.create(author=self.user, conversation=self.conversation, content='asdf')
        self.assertEqual(len(mail.outbox), 0)


class TestConversationsMessageReactionsPostAPI(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.user2 = UserFactory()
        self.group = GroupFactory(members=[self.user, self.user2])
        self.conversation = Conversation.objects.get_or_create_for_target(self.group)
        self.conversation.join(self.user)
        self.participant = ConversationParticipant.objects.get(conversation=self.conversation, user=self.user)
        self.message = self.conversation.messages.create(author=self.user, content='hello')
        self.reaction = self.message.reactions.create(user=self.user, name='thumbsdown')

        self.group2 = GroupFactory(members=[self.user])
        self.conversation2 = Conversation.objects.get_or_create_for_target(self.group2)
        self.conversation2.join(self.user)
        self.message2 = self.conversation2.messages.create(author=self.user, content='hello2')

    # - not logged (403)
    # - logged
    # -- not in conversation (403)
    # -- in conversation
    # --- invalid data
    # ---- invalid message id is like nonexistent message (404)
    # ---- invalid emoji name (400)
    # --- valid data
    # ---- non-existent mesage (404)
    # ---- user already reacted with this emoji (409 Conflict)
    # ---- all good (201 Created)

    # - not logged (403)
    def test_not_logged(self):
        """Non-authenticated user can't add emoji."""

        # log in is missing

        data = {'name': 'thumbsup'}
        response = self.client.post(
            '/api/messages/{}/reactions/'.format(self.message.id),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # - logged
    # -- not in conversation (403)
    def test_add_emoji_to_message_of_other_group(self):
        """It should be impossible to add emoji to a message from group user is not member of."""

        # log in as user who didn't join the conversation
        self.client.force_login(user=self.user2)
        data = {'name': 'thumbsup'}
        response = self.client.post(
            '/api/messages/{}/reactions/'.format(self.message2.id),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # -- in conversation
    # --- invalid data
    # ---- invalid message id is like nonexistent message (404)
    def test_add_to_message_with_invalid_id(self):
        """It should fail predictably when message has invalid id. (respond status 404)"""

        # it is simply nonexistent message, response status 404. No need to implement 400 for this.

        # log in
        self.client.force_login(user=self.user)
        data = {'name': 'thumbsup'}
        response = self.client.post(
            '/api/messages/{}/reactions/'.format('invalid'),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ---- invalid emoji name (400)
    def test_add_nonexistent_emoji(self):
        """It should be impossible to add an unsupported emoji. (respond 400)"""

        # log in
        self.client.force_login(user=self.user)
        data = {'name': 'nonexistent_emoji'}
        response = self.client.post(
            '/api/messages/{}/reactions/'.format(self.message.id),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # --- valid data
    # ---- non-existent message (404)
    def test_reaction_to_nonexistent_message(self):
        """It should error with 404 when trying to react to nonexistent message."""

        # log in as user who didn't join the conversation
        self.client.force_login(user=self.user)

        data = {'name': 'thumbsup'}
        response = self.client.post(
            '/api/messages/{}/reactions/'.format(1735),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ---- user already reacted with this emoji (409 Conflict)
    def test_dont_react_twice_with_the_same_emoji(self):
        """Can not react with the same emoji twice."""

        # log in
        self.client.force_login(user=self.user)
        data = {'name': 'thumbsup'}

        # first request is ok
        response = self.client.post(
            '/api/messages/{}/reactions/'.format(self.message.id),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # second request fails
        response = self.client.post(
            '/api/messages/{}/reactions/'.format(self.message.id),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # ---- all good (201 Created)
    def test_react_to_message_with_emoji(self):
        """User who can participate in conversation can react to a message with emoji."""

        # log in
        self.client.force_login(user=self.user)
        data = {'name': 'tada'}
        response = self.client.post(
            '/api/messages/{}/reactions/'.format(self.message.id),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'tada')
        # @TODO test that the data was saved into database

    # ---- emojis are normalized (201 Created)
    def test_emojis_save_base_form_of_name(self):
        """Emojis are saved in their base form (i.e. +1 -> thumbsup)"""

        # log in
        self.client.force_login(user=self.user)
        data = {'name': '+1'}
        response = self.client.post(
            '/api/messages/{}/reactions/'.format(self.message.id),
            data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'thumbsup')

        # and the base form can't be saved now
        response = self.client.post(
            '/api/messages/{}/reactions/'.format(self.message.id),
            {'name': 'thumbsup'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_react_with_different_emoji(self):
        """Can react multiple times with different emoji."""

        # log in
        self.client.force_login(user=self.user)

        # first request is ok
        response = self.client.post(
            '/api/messages/{}/reactions/'.format(self.message.id),
            {'name': 'thumbsup'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # second request with different emoji is ok
        response = self.client.post(
            '/api/messages/{}/reactions/'.format(self.message.id),
            {'name': 'tada'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    # related: messages include reactions
    def test_include_reactions_in_message(self):
        """When reading conversations, include reactions in the response for every message"""

        # add a few more reactions
        self.reaction = self.message.reactions.create(user=self.user, name='thumbsup')
        self.reaction = self.message.reactions.create(user=self.user2, name='thumbsup')

        self.client.force_login(user=self.user)
        response = self.client.get('/api/messages/?conversation={}'.format(self.conversation.id), format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(len(response.data['results'][0]['reactions']), 3)


class TestConversationsMessageReactionsDeleteAPI(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.user2 = UserFactory()
        self.group = GroupFactory(members=[self.user])
        self.conversation = Conversation.objects.get_or_create_for_target(self.group)
        self.conversation.join(self.user)
        self.participant = ConversationParticipant.objects.get(conversation=self.conversation, user=self.user)
        self.message = self.conversation.messages.create(author=self.user, content='hello')
        self.reaction = self.message.reactions.create(user=self.user, name='thumbsup')

        self.group2 = GroupFactory(members=[self.user])
        self.conversation2 = Conversation.objects.get_or_create_for_target(self.group2)
        self.conversation2.join(self.user)
        self.message2 = self.conversation2.messages.create(author=self.user, content='hello2')

    # - not logged (403)
    # - logged
    # -- not in conversation (403)
    # -- in conversation
    # --- invalid data
    # ---- invalid message id is like nonexistent message (404)
    # ---- invalid emoji name (400)
    # --- valid data
    # ---- non-existent mesage (404)
    # ---- non-existent reaction (404)
    # ---- all good (204 No Content)

    # - not logged (403)
    def test_remove_reaction_not_authenticated(self):
        """Unauthenticated user can't remove a reaction."""

        # log in is missing

        # first request is ok
        response = self.client.delete(
            '/api/messages/{}/reactions/{}/'.format(self.message.id, 'thumbsup'),
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # - logged
    # -- not in conversation (403)
    def test_not_in_conversation_cant_remove_reaction(self):
        """User can't remove a reaction of message from alien conversation, but fails with 403."""

        # log in as alien user
        self.client.force_login(user=self.user2)

        # first request is ok
        response = self.client.delete(
            '/api/messages/{}/reactions/{}/'.format(self.message.id, 'thumbsup'),
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # -- in conversation
    # --- invalid data
    # ---- invalid message id is like nonexistent message (404)
    def test_remove_reaction_invalid_message_id(self):
        """When message has invalid name, it should fail predictably. (404)"""

        # log in
        self.client.force_login(user=self.user)

        response = self.client.delete(
            '/api/messages/{}/reactions/{}/'.format('hello', 'thumbsup'),
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ---- invalid emoji name (400)
    def test_remove_reaction_invalid_emoji_name(self):
        """When emoji has invalid name, response should be 400."""

        # log in
        self.client.force_login(user=self.user)

        response = self.client.delete(
            '/api/messages/{}/reactions/{}/'.format(self.message.id, 'invalid_emoji'),
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # --- valid data
    # ---- non-existent mesage (404)
    def test_remove_reaction_message_not_exist(self):
        """When message with given id doesn't exist, respond with 404."""

        # log in
        self.client.force_login(user=self.user)

        # first request is ok
        response = self.client.delete(
            '/api/messages/{}/reactions/{}/'.format(7321, 'thumbsup'),
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ---- non-existent reaction (404)
    def test_remove_nonexisting_reaction(self):
        """When we try to remove nonexisting reaction, response should be 404."""

        # log in
        self.client.force_login(user=self.user)

        # first request is ok
        response = self.client.delete(
            '/api/messages/{}/reactions/{}/'.format(self.message.id, '-1'),
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # ---- all good (204 No Content)
    def test_remove_existing_reaction(self):
        """User can remove her reaction."""

        # log in
        self.client.force_login(user=self.user)

        # first request is ok
        response = self.client.delete(
            '/api/messages/{}/reactions/{}/'.format(self.message.id, 'thumbsup'),
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_remove_non_base_name(self):
        """Can remove +1, -1, which removes thumbsup, thumbsdown, etc."""

        # log in
        self.client.force_login(user=self.user)

        # first request is ok
        response = self.client.delete(
            '/api/messages/{}/reactions/{}/'.format(self.message.id, '+1'),
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
