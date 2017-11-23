from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.users.factories import VerifiedUserFactory


class TestPasswordReset(APITestCase):
    def setUp(self):
        self.verified_user = VerifiedUserFactory(email='reset_test@example.com')
        self.url = '/api/auth/reset_password/'
        mail.outbox = []

    def test_reset_password_succeeds(self):
        response = self.client.post(self.url, {'email': self.verified_user.email})
        self.assertEqual(response.data, {})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'New password')
        self.assertEqual(mail.outbox[0].to, [self.verified_user.email])

    def test_reset_password_fails_if_wrong_mail(self):
        response = self.client.post(self.url, {'email': 'wrong@example.com'})
        self.assertIsNone(response.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)

    def test_reset_password_fails_if_no_email(self):
        response = self.client.post(self.url)
        self.assertEqual(response.data, {'error': 'mail address is not provided'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)

    def test_reset_password_with_similar_email_succeeds(self):
        response = self.client.post(self.url, {'email': 'RESET_test@example.com'})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [self.verified_user.email])
