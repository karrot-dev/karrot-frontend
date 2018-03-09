from datetime import timedelta

from django.core import mail
from django.test import TestCase
from django.utils import timezone

from config import settings
from foodsaving.groups.factories import GroupFactory
from foodsaving.groups.models import GroupMembership
from foodsaving.groups.tasks import process_inactive_users
from foodsaving.users.factories import UserFactory


class TestProcessInactiveUsers(TestCase):
    def setUp(self):
        self.active_user = UserFactory()
        self.inactive_user = UserFactory()
        self.group = GroupFactory(members=[self.active_user, self.inactive_user])

        now = timezone.now()

        inactive_email_date = now - timedelta(days=settings.NUMBER_OF_DAYS_UNTIL_INACTIVE_IN_GROUP + 1)
        self.active_membership = GroupMembership.objects.get(group=self.group, user=self.active_user)
        self.inactive_membership = GroupMembership.objects.get(group=self.group, user=self.inactive_user)
        self.inactive_membership.lastseen_at = inactive_email_date
        self.inactive_membership.save()

        mail.outbox = []

    def test_process_inactive_users_leaves_active_user_alone(self):
        process_inactive_users()
        self.active_membership.refresh_from_db()
        self.assertEqual(self.active_membership.inactive_at, None)

    def test_process_inactive_users_flags_inactive_user(self):
        process_inactive_users()
        self.inactive_membership.refresh_from_db()
        self.assertNotEqual(self.inactive_membership.inactive_at, None)

    def test_process_inactive_users_sends_email(self):
        process_inactive_users()
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [self.inactive_user.email])
