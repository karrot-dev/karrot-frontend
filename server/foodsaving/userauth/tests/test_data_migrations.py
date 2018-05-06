from datetime import timedelta

from django.utils import timezone

from foodsaving.tests.utils import TestMigrations
from foodsaving.utils.tests.fake import faker
from foodsaving.userauth.models import VerificationCode as VerificationCodeRecent


class TestMigrateEmailVerificationCodes(TestMigrations):
    migrate_from = [('users', '0017_auto_20171207_1210'), ('userauth', '0001_initial')]
    migrate_to = [('users', '0017_auto_20171207_1210'), ('userauth', '0002_import_email_verification_codes')]

    def setUpBeforeMigration(self, apps):
        User = apps.get_model('users', 'User')

        self.user_not_verified = User.objects.create(email=faker.email(),
                                                     activation_key='123',
                                                     key_expires_at=timezone.now() + timedelta(minutes=1),
                                                     mail_verified=False)
        self.user_verified = User.objects.create(email=faker.email(),
                                                 activation_key='',
                                                 key_expires_at=None,
                                                 mail_verified=True)
        self.user_code_expired = User.objects.create(email=faker.email(),
                                                     activation_key='123',
                                                     key_expires_at=timezone.now() - timedelta(minutes=1),
                                                     mail_verified=False)

    def test_migrate_email_verification_codes(self):
        VerificationCode = self.apps.get_model('userauth', 'VerificationCode')

        self.assertEqual(VerificationCode.objects.count(), 1)

        code = VerificationCode.objects.get(user__pk=self.user_not_verified.pk)
        self.assertEqual(code.code, self.user_not_verified.activation_key)
        self.assertEqual(code.type, VerificationCodeRecent.EMAIL_VERIFICATION)
        self.assertIsNone(code.invalidated_at)
