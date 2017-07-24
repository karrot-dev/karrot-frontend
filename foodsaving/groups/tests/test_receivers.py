from django.test import TestCase
from django.utils import timezone

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

