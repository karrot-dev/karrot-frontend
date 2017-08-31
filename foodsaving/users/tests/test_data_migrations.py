import logging

from django.db import connection

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

        with connection.cursor() as cursor:
            cursor.execute("""
            INSERT INTO users_user (
              email, password, created_at, is_active, is_staff, display_name, profile_visibility
            ) values (
              %s, %s, now(), 't', 'f', %s, 0
            )
            """, [self.email, 'yay', 'peter'])
            cursor.execute("SELECT email FROM users_user WHERE email = %s", [self.email])
            row = cursor.fetchone()
            self.assertEqual(row, (self.email,))  # pass

    def test_unverified_email_set(self):
        with connection.cursor() as cursor:
            cursor.execute("SELECT email, unverified_email FROM users_user WHERE email = %s", [self.email])
            row = cursor.fetchone()
            self.assertEqual(row, (self.email, self.email))
