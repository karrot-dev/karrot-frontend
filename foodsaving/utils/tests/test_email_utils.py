from dateutil.relativedelta import relativedelta
from django.utils import timezone
from freezegun import freeze_time
from rest_framework.test import APITestCase

from config import settings
from foodsaving.groups.factories import GroupFactory
from foodsaving.invitations.models import Invitation
from foodsaving.pickups.factories import PickupDateFactory
from foodsaving.stores.factories import StoreFactory
from foodsaving.userauth.models import VerificationCode
from foodsaving.users.factories import UserFactory
from foodsaving.utils import email_utils


class TestEmailUtils(APITestCase):
    def setUp(self):
        self.group = GroupFactory()
        self.user = UserFactory()

    def test_emailinvitation(self):
        invitation = Invitation.objects.create(
            email='bla@bla.com',
            group=self.group,
            invited_by=self.user
        )
        email = email_utils.prepare_emailinvitation_email(invitation)
        self.assertEqual(len(email.alternatives), 0)
        self.assertEqual(email.to[0], 'bla@bla.com')
        self.assertIn(self.group.name, email.body)
        self.assertIn(self.user.display_name, email.body)
        self.assertIn(str(invitation.token), email.body)
        self.assertIn(settings.SITE_NAME, email.body)
        self.assertIn(settings.HOSTNAME, email.body)
        self.assertNotIn('&amp;', email.body)

    def test_mailverification(self):
        verification_code = VerificationCode.objects.get(user=self.user)
        email = email_utils.prepare_mailverification_email(
            user=self.user,
            verification_code=verification_code,
        )
        self.assertEqual(email.to[0], self.user.unverified_email)

        self.assertEqual(len(email.alternatives), 1)
        html, mimetype = email.alternatives[0]

        self.assertEqual(mimetype, 'text/html')

        self.assertIn(self.user.display_name, email.body)
        self.assertIn(settings.SITE_NAME, email.body)
        self.assertIn(settings.HOSTNAME, email.body)
        self.assertIn(verification_code.code, email.body)

        self.assertIn(self.user.display_name, html)
        self.assertIn(settings.SITE_NAME, html)
        self.assertIn(settings.HOSTNAME, html)
        self.assertIn(verification_code.code, html)

    def test_send_new_verification_code(self):
        verification_code = VerificationCode.objects.get(user=self.user)
        email = email_utils.prepare_send_new_verification_code_email(self.user, verification_code)
        self.assertEqual(len(email.alternatives), 0)
        self.assertEqual(email.to[0], self.user.unverified_email)
        self.assertIn(settings.HOSTNAME, email.body)
        self.assertIn(verification_code.code, email.body)


class TestGroupSummaryEmails(APITestCase):
    def setUp(self):
        self.group = GroupFactory()

    def test_creates_one_email_for_one_language(self):
        n = 5
        for i in list(range(n)):
            self.group.add_member(UserFactory(language='en'))

        from_date, to_date = email_utils.calculate_group_summary_dates(self.group)
        emails = email_utils.prepare_group_summary_emails(self.group, from_date, to_date)
        self.assertEqual(self.group.members.count(), n)
        self.assertEqual(len(emails), 1)

    def test_creates_three_emails_for_three_languages(self):
        n = 5
        for _ in list(range(n)):
            self.group.add_member(UserFactory(language='en'))

        for _ in list(range(n)):
            self.group.add_member(UserFactory(language='de'))

        for _ in list(range(n)):
            self.group.add_member(UserFactory(language='fr'))

        from_date, to_date = email_utils.calculate_group_summary_dates(self.group)
        emails = email_utils.prepare_group_summary_emails(self.group, from_date, to_date)
        self.assertEqual(self.group.members.count(), n * 3)
        self.assertEqual(len(emails), 3)

    def test_group_summary_data(self):

        a_couple_of_weeks_ago = timezone.now() - relativedelta(weeks=3)
        a_few_days_ago = timezone.now() - relativedelta(days=4)

        store = StoreFactory(group=self.group)
        old_user = UserFactory()
        user = UserFactory()

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

        from_date, to_date = email_utils.calculate_group_summary_dates(self.group)
        data = email_utils.prepare_group_summary_data(self.group, from_date, to_date)
        self.assertEqual(data['pickups_done_count'], 1)
        self.assertEqual(data['pickups_missed_count'], 1)
        self.assertEqual(len(data['new_users']), 1)
        self.assertEqual(len(data['messages']), 2)
