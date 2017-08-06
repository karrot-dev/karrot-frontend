from django.db import IntegrityError
from django.test import TestCase

from foodsaving.conversations.factories import ConversationFactory
from foodsaving.conversations.models import Conversation, ConversationMessage
from foodsaving.groups.factories import GroupFactory
from foodsaving.users.factories import UserFactory


class ConversationModelTests(TestCase):
    def test_join(self):
        user = UserFactory()
        conversation = ConversationFactory()
        conversation.join(user)
        self.assertIn(user, conversation.participants.all())

    def test_leave(self):
        user = UserFactory()
        conversation = ConversationFactory()
        conversation.join(user)
        self.assertIn(user, conversation.participants.all())
        conversation.leave(user)
        self.assertNotIn(user, conversation.participants.all())

    def test_sync_users(self):
        user1 = UserFactory()
        user2 = UserFactory()
        user3 = UserFactory()
        user4 = UserFactory()
        users = [user1, user2, user3]
        conversation = ConversationFactory()
        conversation.join(user1)  # should not be added again
        conversation.join(user4)  # should be removed
        conversation.sync_users(users)
        self.assertEqual(conversation.participants.count(), 3)
        self.assertIn(user1, conversation.participants.all())
        self.assertIn(user2, conversation.participants.all())
        self.assertIn(user3, conversation.participants.all())
        self.assertNotIn(user4, conversation.participants.all())

    def test_message_create(self):
        user = UserFactory()
        conversation = ConversationFactory()
        conversation.messages.create(author=user, content='yay')
        self.assertEqual(ConversationMessage.objects.filter(author=user).count(), 1)

    def test_message_create_requires_author(self):
        conversation = ConversationFactory()
        with self.assertRaises(IntegrityError):
            conversation.messages.create(content='ohno')

    def test_creating_from_target(self):
        target = GroupFactory()  # could be any model
        conversation = Conversation.objects.get_or_create_for_target(target)
        self.assertIsNotNone(conversation)
        self.assertEqual(conversation.target, target)

    def test_mixin(self):
        target = GroupFactory()  # must be a model which uses the mixin
        conversation = Conversation.objects.get_or_create_for_target(target)
        self.assertIsNotNone(conversation)
        self.assertEqual(target.conversation, conversation)
