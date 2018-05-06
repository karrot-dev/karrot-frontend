from datetime import timedelta

from django.core import mail
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.users.factories import VerifiedUserFactory
from foodsaving.userauth.models import VerificationCode


class TestPasswordReset(APITestCase):
    def setUp(self):
        self.verified_user = VerifiedUserFactory(email='reset_test@example.com')
        self.url_request_password_reset = '/api/auth/password/request_reset/'
        self.url_password_reset = '/api/auth/password/reset/'
        self.type = VerificationCode.PASSWORD_RESET
        self.old_password = self.verified_user.display_name
        self.new_password = 'super-safe'
        mail.outbox = []

    def test_request_password_reset_succeeds(self):
        response = self.client.post(self.url_request_password_reset, {'email': self.verified_user.email})
        self.assertEqual(response.data, {})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Request to reset your password', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.verified_user.email])

    def test_request_password_reset_fails_if_wrong_mail(self):
        response = self.client.post(self.url_request_password_reset, {'email': 'wrong@example.com'})
        self.assertEqual(response.data, {'email': ['Unknown e-mail address']})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)

    def test_request_password_reset_fails_if_no_email(self):
        response = self.client.post(self.url_request_password_reset)
        self.assertEqual(response.data, {'email': ['This field is required.']})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)

    def test_request_password_reset_with_similar_email_succeeds(self):
        response = self.client.post(self.url_request_password_reset, {'email': 'RESET_test@example.com'})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [self.verified_user.email])

    def test_request_password_reset_twice_succeeds(self):
        self.client.post(self.url_request_password_reset, {'email': self.verified_user.email})
        response = self.client.post(self.url_request_password_reset, {'email': self.verified_user.email})
        self.assertEqual(response.data, {})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 2)

        code = VerificationCode.objects.get(user=self.verified_user, type=self.type).code
        response = self.client.post(self.url_password_reset, {'code': code, 'new_password': self.new_password})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 3)

    def test_password_reset_succeeds(self):
        self.client.post(self.url_request_password_reset, {'email': self.verified_user.email})
        code = VerificationCode.objects.get(user=self.verified_user, type=self.type).code
        response = self.client.post(self.url_password_reset, {'code': code, 'new_password': self.new_password})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 2)
        self.assertIn('New password set!', mail.outbox[1].subject)
        self.assertEqual(mail.outbox[1].to, [self.verified_user.email])

        # Login with the old password does not work
        self.assertFalse(self.client.login(email=self.verified_user.email, password=self.old_password))
        # Login with empty password does not work either
        self.assertFalse(self.client.login(email=self.verified_user.email, password=''))
        # Login with the new password works
        self.assertTrue(self.client.login(email=self.verified_user.email, password=self.new_password))

    def test_password_reset_fails_without_verification_code(self):
        self.client.post(self.url_request_password_reset, {'email': self.verified_user.email})
        response = self.client.post(self.url_password_reset, {'new_password': self.new_password})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'code': ['This field is required.']})
        self.assertEqual(len(mail.outbox), 1)

        # Login with the old password still works
        self.assertTrue(self.client.login(email=self.verified_user.email, password=self.old_password))

    def test_password_reset_fails_if_verification_code_too_old(self):
        self.client.post(self.url_request_password_reset, {'email': self.verified_user.email})
        verification_code = VerificationCode.objects.get(user=self.verified_user, type=self.type)
        verification_code.created_at = timezone.now() - timedelta(days=8)
        verification_code.save()
        response = self.client.post(self.url_password_reset, {'code': verification_code.code,
                                                              'new_password': self.new_password})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['code'], ['Verification code has expired'])
        self.assertEqual(len(mail.outbox), 1)

        # Login with the old password still works
        self.assertTrue(self.client.login(email=self.verified_user.email, password=self.old_password))

    def test_password_reset_fails_without_new_password(self):
        self.client.post(self.url_request_password_reset, {'email': self.verified_user.email})
        code = VerificationCode.objects.get(user=self.verified_user, type=self.type).code
        response = self.client.post(self.url_password_reset, {'code': code})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'new_password': ['This field is required.']})
        self.assertEqual(len(mail.outbox), 1)

        # Login with the old password still works
        self.assertTrue(self.client.login(email=self.verified_user.email, password=self.old_password))

    def test_password_reset_fails_with_previous_verification_code(self):
        self.client.post(self.url_request_password_reset, {'email': self.verified_user.email})
        code = VerificationCode.objects.get(user=self.verified_user, type=self.type).code
        self.client.post(self.url_request_password_reset, {'email': self.verified_user.email})
        response = self.client.post(self.url_password_reset, {'code': code, 'new_password': self.new_password})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['code'], ['Verification code is invalid'])

        # Login with the old password still works
        self.assertTrue(self.client.login(email=self.verified_user.email, password=self.old_password))
