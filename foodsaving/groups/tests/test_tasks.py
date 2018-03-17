from datetime import timedelta
from unittest.mock import patch

from dateutil.relativedelta import relativedelta
from django.core import mail
from django.test import TestCase
from django.utils import timezone
from freezegun import freeze_time

from config import settings
from foodsaving.groups.factories import GroupFactory, PlaygroundGroupFactory, InactiveGroupFactory
from foodsaving.groups.models import GroupMembership
from foodsaving.groups.tasks import process_inactive_users, send_summary_emails
from foodsaving.pickups.factories import PickupDateFactory, FeedbackFactory
from foodsaving.stores.factories import StoreFactory
from foodsaving.users.factories import UserFactory, VerifiedUserFactory


def set_member_inactive(group, user):
    inactive_email_date = timezone.now() - timedelta(days=settings.NUMBER_OF_DAYS_UNTIL_INACTIVE_IN_GROUP + 1)
    inactive_membership = GroupMembership.objects.get(group=group, user=user)
    inactive_membership.lastseen_at = inactive_email_date
    inactive_membership.save()
    return inactive_membership


class TestProcessInactiveUsers(TestCase):
    def setUp(self):
        self.active_user = UserFactory()
        self.inactive_user = UserFactory()
        self.group = GroupFactory(members=[self.active_user, self.inactive_user])

        self.active_membership = GroupMembership.objects.get(group=self.group, user=self.active_user)
        self.inactive_membership = set_member_inactive(self.group, self.inactive_user)

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


class TestProcessInactiveUsersNonActiveGroup(TestCase):
    def setUp(self):
        inactive_user = UserFactory()
        playground_group = PlaygroundGroupFactory(members=[inactive_user])
        inactive_group = InactiveGroupFactory(members=[inactive_user])

        set_member_inactive(playground_group, inactive_user)
        set_member_inactive(inactive_group, inactive_user)

        mail.outbox = []

    def test_dont_send_email_in_playground_group(self):
        process_inactive_users()
        self.assertEqual(len(mail.outbox), 0)


class TestSummaryEmailTask(TestCase):
    def setUp(self):
        self.group = GroupFactory()

    @patch('foodsaving.groups.stats.write_points')
    def test_collects_stats(self, write_points):
        a_few_days_ago = timezone.now() - relativedelta(days=4)
        store = StoreFactory(group=self.group)

        message_count = 10
        pickups_missed_count = 5
        feedback_count = 4
        new_user_count = 3
        pickups_done_count = 8

        new_users = [VerifiedUserFactory() for _ in range(new_user_count)]
        user = new_users[0]

        with freeze_time(a_few_days_ago, tick=True):
            [self.group.add_member(u) for u in new_users]

            # a couple of messages
            [self.group.conversation.messages.create(author=user, content='hello') for _ in range(message_count)]

            # missed pickups
            [PickupDateFactory(store=store) for _ in range(pickups_missed_count)]

            # fullfilled pickups
            pickups = [
                PickupDateFactory(store=store, max_collectors=1, collectors=[user])
                for _ in range(pickups_done_count)
            ]

            # pickup feedback
            [FeedbackFactory(about=pickup, given_by=user) for pickup in pickups[:feedback_count]]

        write_points.reset_mock()

        send_summary_emails()

        write_points.assert_called_with([{
            'measurement': 'karrot.email.group_summary',
            'tags': {
                'group': str(self.group.id)
            },
            'fields': {
                'value': 1,
                'new_user_count': new_user_count,
                'email_recipient_count': new_user_count,
                'feedback_count': feedback_count,
                'pickups_missed_count': pickups_missed_count,
                'message_count': message_count,
                'pickups_done_count': pickups_done_count,
            },
        }])
