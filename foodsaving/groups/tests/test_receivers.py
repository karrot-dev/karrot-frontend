from django.contrib.contenttypes.models import ContentType
from django.test import TestCase
from django.utils import timezone

from foodsaving.conversations.models import Conversation
from foodsaving.groups.factories import GroupFactory
from foodsaving.groups.receivers import handle_invitation_accepted
from foodsaving.history.models import History
from foodsaving.users.factories import UserFactory


class TestInvitationReceiver(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.invited_by = UserFactory()
        cls.group = GroupFactory(members=[cls.invited_by, ])
        cls.user = UserFactory()
        cls.invited_at = timezone.now()

    def test_invite_accepted_joins_group_and_adds_history(self):
        handle_invitation_accepted(
            None,
            group=self.group,
            accepted_user=self.user,
            invited_by=self.invited_by,
            invited_at=self.invited_at
        )

        h = History.objects.all()
        self.assertEqual(h.count(), 1)
        h = h.first()
        self.assertEqual(h.payload['invited_by'], self.invited_by.id)
        self.assertEqual(h.payload['invited_at'], self.invited_at.isoformat())
        self.assertEqual(h.payload['invited_via'], 'e-mail')


class TestConversationReceiver(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.invited_by = UserFactory()
        cls.group = GroupFactory(members=[cls.invited_by, ])
        cls.user = UserFactory()
        cls.invited_at = timezone.now()

    def test_creates_conversation(self):
        group = GroupFactory()
        conversation = self.get_conversation_for_group(group)
        self.assertIsInstance(conversation, Conversation, 'Did not have a conversation')

    def test_conversation_deleted(self):
        group = GroupFactory()
        conversation_id = group.conversation.id
        group.delete()
        with self.assertRaises(Conversation.DoesNotExist):
            self.assertIsNone(Conversation.objects.get(pk=conversation_id))

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

    def get_conversation_for_group(self, group):
        return Conversation.objects.filter(target_id=group.id,
                                           target_type=ContentType.objects.get_for_model(group)).first()
