from django.core import mail
from django.test import TestCase
from django.utils import timezone

from foodsaving.conversations.tasks import notify_participants
from foodsaving.groups.factories import GroupFactory
from foodsaving.users.factories import VerifiedUserFactory, UserFactory


class TestConversationNotificationTask(TestCase):

    def setUp(self):
        self.user = VerifiedUserFactory()
        self.unverified_user = UserFactory()
        self.inactive_user = VerifiedUserFactory()
        self.author = VerifiedUserFactory()
        self.group = GroupFactory(members=[self.author, self.user, self.inactive_user, self.unverified_user])
        self.group.groupmembership_set.filter(user=self.inactive_user).update(inactive_at=timezone.now())
        self.message = self.group.conversation.messages.create(author=self.author, content='foo')
        mail.outbox = []

    def test_only_notifies_active_group_members(self):
        notify_participants(self.message)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
