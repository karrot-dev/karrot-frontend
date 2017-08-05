from coverage.backunittest import TestCase
from django.contrib.contenttypes.models import ContentType

from foodsaving.conversations.models import Conversation
from foodsaving.groups.factories import GroupFactory
from foodsaving.users.factories import UserFactory


class TestConversationSyncReceiver(TestCase):
    def test_creates_conversation(self):
        group = GroupFactory()
        conversation = self.get_conversation_for_group(group)
        self.assertIsInstance(conversation, Conversation, 'Did not have a conversation')

    def test_adds_participant(self):
        group = GroupFactory()
        user = UserFactory()
        group.members.add(user)
        conversation = self.get_conversation_for_group(group)
        self.assertIn(user, conversation.participants.all(), 'Conversation did not have user in')

    def test_removes_participant(self):
        user = UserFactory()
        group = GroupFactory(members=[user])
        group.members.remove(user)
        conversation = self.get_conversation_for_group(group)
        self.assertNotIn(user, conversation.participants.all(), 'Conversation still had user in')

    def test_deletes_conversation(self):
        group = GroupFactory()
        self.assertIsNotNone(self.get_conversation_for_group(group))
        group.delete()
        self.assertIsNone(self.get_conversation_for_group(group))

    def get_conversation_for_group(self, group):
        return Conversation.objects.filter(target_id=group.id,
                                           target_type=ContentType.objects.get_for_model(group)).first()
