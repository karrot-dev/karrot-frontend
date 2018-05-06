import logging

from dateutil.relativedelta import relativedelta
from django.utils import timezone

from foodsaving.history.models import HistoryTypus
from foodsaving.tests.utils import TestMigrations
from foodsaving.utils.tests.fake import faker


class TestLastseenAtDataMigration(TestMigrations):
    migrate_from = [
        ('history', '0004_auto_20170701_1555'),
        ('users', '0020_user_mobile_number'),
        ('groups', '0022_remove_group_slack_webhook'),
    ]
    migrate_to = [
        ('groups', '0023_set_sensible_lastseen_at_20180304_1330'),
    ]

    def tearDown(self):
        logging.disable(logging.NOTSET)

    def setUpBeforeMigration(self, apps):
        logging.disable(logging.CRITICAL)
        self.email = faker.email()
        User = apps.get_model('users', 'User')
        History = apps.get_model('history', 'History')
        Group = apps.get_model('groups', 'Group')
        GroupMembership = apps.get_model('groups', 'GroupMembership')
        self.user = User.objects.create(email=self.email, display_name='Peter')
        self.group = Group.objects.create(
            name=faker.name(),
            description=faker.sentence(nb_words=40),
            public_description=faker.sentence(nb_words=20),
        )
        membership = GroupMembership.objects.create(group=self.group, user=self.user)
        self.membership_id = membership.id
        self.history = History.objects.create(
            typus=HistoryTypus.GROUP_CREATE,
            group=self.group,
            payload={},
        )
        self.history.users.add(self.user)
        self.history.save()

        self.history.date = timezone.now() - relativedelta(days=100)
        self.history.save()

        self.user.created_at = timezone.now() - relativedelta(days=200)
        self.user.save()

    def test_sets_lastseen_to_last_history_item(self):
        GroupMembership = self.apps.get_model('groups', 'GroupMembership')
        membership = GroupMembership.objects.get(pk=self.membership_id)
        self.assertEqual(membership.lastseen_at, self.history.date)
