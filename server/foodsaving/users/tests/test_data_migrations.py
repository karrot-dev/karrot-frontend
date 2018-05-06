import logging

from foodsaving.tests.utils import TestMigrations
from foodsaving.utils.tests.fake import faker


class TestUnverifiedMailDataMigration(TestMigrations):
    migrate_from = [('walls', '0001_initial'), ('users', '0001_initial')]
    migrate_to = [('users', '0015_auto_20170413_1731')]

    def tearDown(self):
        logging.disable(logging.NOTSET)

    def setUpBeforeMigration(self, apps):
        logging.disable(logging.CRITICAL)
        self.email = faker.email()
        User = apps.get_model('users', 'User')
        User.objects.create(email=self.email, display_name='Peter')

    def test_unverified_email_set(self):
        User = self.apps.get_model('users', 'User')
        user = User.objects.filter(email=self.email).first()
        self.assertEqual(self.email, user.email)
        self.assertEqual(self.email, user.unverified_email)
