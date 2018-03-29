from random import randint

from dateutil.relativedelta import relativedelta
from django.contrib.auth import get_user_model
from django.utils import timezone
from freezegun import freeze_time
from rest_framework.test import APITestCase

import foodsaving.groups
import foodsaving.groups.emails as group_emails
from foodsaving.groups.factories import GroupFactory
from foodsaving.groups.models import GroupNotificationType, GroupMembership
from foodsaving.pickups.factories import PickupDateFactory
from foodsaving.stores.factories import StoreFactory
from foodsaving.users.factories import VerifiedUserFactory, UserFactory


class TestGroupSummaryEmails(APITestCase):
    def setUp(self):
        self.group = GroupFactory()

        self.user_without_notifications = VerifiedUserFactory(language='en')
        self.group.add_member(self.user_without_notifications)
        m = GroupMembership.objects.get(group=self.group, user=self.user_without_notifications)
        m.notification_types = []
        m.save()

        # it should ignore unverified and inactive users so adding a random number
        # of them here should not change anything

        unverified_users = [UserFactory(language='en') for _ in list(range(randint(2, 5)))]
        for user in unverified_users:
            self.group.add_member(user)

        inactive_users = [VerifiedUserFactory(language='en') for _ in list(range(randint(2, 5)))]
        for user in inactive_users:
            membership = self.group.add_member(user)
            membership.inactive_at = timezone.now()
            membership.save()

    def test_creates_one_email_for_one_language(self):
        n = 5
        for i in list(range(n)):
            self.group.add_member(VerifiedUserFactory(language='en'))

        from_date, to_date = group_emails.calculate_group_summary_dates(self.group)
        context = group_emails.prepare_group_summary_data(self.group, from_date, to_date)
        emails = group_emails.prepare_group_summary_emails(self.group, context)
        self.assertEqual(len(emails), 1)

        expected_members = self.group.members.filter(
            groupmembership__in=GroupMembership.objects.active().with_notification_type(
                GroupNotificationType.WEEKLY_SUMMARY
            )
        ).exclude(
            groupmembership__user__in=get_user_model().objects.unverified_or_ignored()
        )

        self.assertEqual(
            sorted(emails[0].to),
            sorted([member.email for member in expected_members])
        )
        self.assertNotIn(self.user_without_notifications.email, emails[0].to)

    def test_creates_three_emails_for_three_languages(self):
        n = 5

        for _ in list(range(n)):
            self.group.add_member(VerifiedUserFactory(language='en'))

        for _ in list(range(n)):
            self.group.add_member(VerifiedUserFactory(language='de'))

        for _ in list(range(n)):
            self.group.add_member(VerifiedUserFactory(language='fr'))

        from_date, to_date = group_emails.calculate_group_summary_dates(self.group)
        context = group_emails.prepare_group_summary_data(self.group, from_date, to_date)
        emails = group_emails.prepare_group_summary_emails(self.group, context)
        self.assertEqual(len(emails), 3)

        to = []
        for email in emails:
            to.extend(email.to)

        expected_members = self.group.members.filter(
            groupmembership__in=GroupMembership.objects.active().with_notification_type(
                GroupNotificationType.WEEKLY_SUMMARY
            )
        ).exclude(
            groupmembership__user__in=get_user_model().objects.unverified_or_ignored()
        )

        self.assertEqual(
            sorted(to),
            sorted([member.email for member in expected_members])
        )

        self.assertNotIn(self.user_without_notifications.email, to)

    def test_ignores_deleted_pickups(self):
        a_few_days_ago = timezone.now() - relativedelta(days=4)

        store = StoreFactory(group=self.group)
        user = VerifiedUserFactory(mail_verified=True)
        self.group.add_member(user)

        with freeze_time(a_few_days_ago, tick=True):
            # fulfilled, but deleted
            PickupDateFactory(store=store, max_collectors=1, collectors=[user], deleted=True)

        from_date, to_date = foodsaving.groups.emails.calculate_group_summary_dates(self.group)
        data = foodsaving.groups.emails.prepare_group_summary_data(self.group, from_date, to_date)

        self.assertEqual(data['pickups_done_count'], 0)

    def test_group_summary_data(self):

        a_couple_of_weeks_ago = timezone.now() - relativedelta(weeks=3)
        a_few_days_ago = timezone.now() - relativedelta(days=4)

        store = StoreFactory(group=self.group)
        old_user = VerifiedUserFactory(mail_verified=True)
        user = VerifiedUserFactory(mail_verified=True)

        # should not be included in summary email
        with freeze_time(a_couple_of_weeks_ago, tick=True):
            self.group.add_member(old_user)
            self.group.conversation.messages.create(author=old_user, content='old message')
            PickupDateFactory(store=store)
            PickupDateFactory(store=store, max_collectors=1, collectors=[old_user])

        # should be included in summary email
        with freeze_time(a_few_days_ago, tick=True):
            self.group.add_member(user)

            # a couple of messages
            self.group.conversation.messages.create(author=user, content='hello')
            self.group.conversation.messages.create(author=user, content='whats up')

            # a missed pickup
            PickupDateFactory(store=store)

            # a fulfilled pickup
            PickupDateFactory(store=store, max_collectors=1, collectors=[user])

        from_date, to_date = foodsaving.groups.emails.calculate_group_summary_dates(self.group)
        data = foodsaving.groups.emails.prepare_group_summary_data(self.group, from_date, to_date)
        self.assertEqual(data['pickups_done_count'], 1)
        self.assertEqual(data['pickups_missed_count'], 1)
        self.assertEqual(len(data['new_users']), 1)
        self.assertEqual(len(data['messages']), 2)
