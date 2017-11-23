from datetime import timedelta

from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.core import mail
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.stores.factories import StoreFactory, PickupDateFactory
from foodsaving.users.factories import UserFactory, VerifiedUserFactory
from foodsaving.utils.tests.fake import faker


class TestUsersAPI(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = '/api/auth/user/'
        self.user_data = {
            'email': faker.email(),
            'password': faker.name(),
            'display_name': faker.name(),
            'address': faker.address(),
            'latitude': faker.latitude(),
            'longitude': faker.longitude()
        }
        mail.outbox = []

    def test_create_user(self):
        response = self.client.post(self.url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], self.user_data['email'])
        self.assertAlmostEqual(response.data['latitude'], float(self.user_data['latitude']))
        self.assertEqual(response.data['description'], '')
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Verify your email address')
        self.assertEqual(mail.outbox[0].to, [self.user_data['email']])
        self.assertIn('Thank you for signing up', mail.outbox[0].body)

    def test_retrieve_user_forbidden(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_user_allowed(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], self.user.description)

    def test_patch_user_forbidden(self):
        response = self.client.patch(self.url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_self_allowed(self):
        self.client.force_login(user=self.user)
        response = self.client.patch(self.url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_only_description(self):
        self.client.force_login(user=self.user)
        response = self.client.patch(self.url, {'description': ' test'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], ' test')

    def test_patch_too_long_description(self):
        self.client.force_login(user=self.user)
        response = self.client.patch(self.url, {'description': 'ab' * settings.DESCRIPTION_MAX_LENGTH}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestUserDeleteAPI(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.user2 = UserFactory()
        self.group = GroupFactory(members=[self.user, self.user2])
        self.store = StoreFactory(group=self.group)
        self.pickupdate = PickupDateFactory(
            store=self.store,
            date=timezone.now() + relativedelta(days=1),
            collectors=[self.user, ])
        self.past_pickupdate = PickupDateFactory(
            store=self.store,
            date=timezone.now() - relativedelta(days=1),
            collectors=[self.user, ]
        )
        self.url = '/api/auth/user/'

    def test_delete_self(self):
        self.assertEqual(self.pickupdate.collectors.count(), 1)
        self.assertEqual(self.past_pickupdate.collectors.count(), 1)

        self.client.force_login(self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT, response.data)

        self.assertFalse(self.group.members.get_queryset().filter(id=self.user.id).exists())
        self.assertFalse(self.pickupdate.collectors.get_queryset().filter(id=self.user.id).exists())
        self.assertTrue(self.past_pickupdate.collectors.get_queryset().filter(id=self.user.id).exists())


class TestCreateUserErrors(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = '/api/auth/user/'

    def test_create_user_with_similar_cased_email_fails(self):
        response = self.client.post(self.url, {
            'email': 'fancy@example.com',
            'password': faker.name(),
            'display_name': faker.name()
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.post(self.url, {
            'email': 'Fancy@example.com',
            'password': faker.name(),
            'display_name': faker.name()
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data['email'], ['Similar e-mail exists: fancy@example.com'])


class TestChangePassword(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = '/api/auth/user/'
        self.data = {'password': 'new_password'}

    def test_change_with_patch_succeeds(self):
        self.client.force_login(user=self.user)
        response = self.client.patch(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # logged out
        response = self.client.patch(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # test new password
        self.assertTrue(self.client.login(email=self.user.email, password='new_password'))

    def test_change_with_all_data_succeeds(self):
        self.client.force_login(user=self.user)
        data = self.client.get(self.url).data
        data['password'] = 'really_new_shiny'
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

        # logged out
        response = self.client.patch(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # test new password
        self.assertTrue(self.client.login(email=self.user.email, password='really_new_shiny'))


class TestChangeEMail(APITestCase):
    def setUp(self):
        self.verified_user = VerifiedUserFactory()
        self.another_user = VerifiedUserFactory()
        self.url = '/api/auth/user/'
        mail.outbox = []

    def test_change_succeeds(self):
        self.client.force_login(user=self.verified_user)
        self.assertTrue(self.verified_user.mail_verified)

        old_email = self.verified_user.email
        new_email = faker.email()

        # typical frontend use case of getting, modifying and sending data
        data = self.client.get(self.url).data
        data['email'] = new_email
        response = self.client.patch(self.url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['email'], old_email)
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].subject, 'Your email address changed!')
        self.assertEqual(mail.outbox[0].to, [old_email], 'error: change notice sent to wrong address')
        self.assertEqual(mail.outbox[1].subject, 'Please verify your email')
        self.assertEqual(
            mail.outbox[1].to,
            [new_email],
            'error: verification request sent to wrong address'
        )
        self.assertNotIn('Thank you for signing up', mail.outbox[1].body)

        self.verified_user.refresh_from_db()
        self.assertFalse(self.verified_user.mail_verified)
        self.assertEqual(self.verified_user.email, old_email)
        self.assertEqual(self.verified_user.unverified_email, new_email)

        self.verified_user.verify_mail()
        self.verified_user.refresh_from_db()
        self.assertTrue(self.verified_user.mail_verified)
        self.assertEqual(self.verified_user.email, new_email)
        response = self.client.get(self.url)
        self.assertEqual(response.data['email'], new_email)

    def test_change_to_existing_mail_fails(self):
        self.client.force_login(user=self.verified_user)
        data = {'email': self.another_user.email}
        response = self.client.patch(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)

    def test_change_to_existing_similar_mail_fails(self):
        self.client.force_login(user=self.verified_user)
        similar_mail = self.another_user.email[0].swapcase() + self.another_user.email[1:]
        data = {'email': similar_mail}
        response = self.client.patch(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['email'], ['Similar e-mail exists: ' + self.another_user.email])
        self.assertEqual(len(mail.outbox), 0)

    def test_change_to_similar_mail_succeeds(self):
        self.client.force_login(user=self.verified_user)
        similar_mail = self.verified_user.email[0].swapcase() + self.verified_user.email[1:]
        data = {'email': similar_mail}
        response = self.client.patch(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 2)

    def test_change_back_to_previous_address(self):
        self.client.force_login(user=self.verified_user)
        original = self.verified_user.email
        response = self.client.patch(self.url, {'email': faker.email()})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 2)
        mail.outbox.clear()
        response = self.client.patch(self.url, {'email': original})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].subject, 'Your email address changed!')
        self.assertEqual(response.data['email'], original)
        self.assertEqual(response.data['mail_verified'], False)

    def test_dont_change_email(self):
        self.client.force_login(user=self.verified_user)
        response = self.client.patch(self.url, {'email': self.verified_user.email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['mail_verified'], True)
        self.assertEqual(len(mail.outbox), 0)

    def test_changing_sensitive_fields_is_forbidden(self):
        self.client.force_login(user=self.verified_user)
        response = self.client.get(self.url)
        original = response.data

        response = self.client.patch(self.url, {'unverified_email': faker.email()})
        self.assertEqual(response.data['unverified_email'], original['unverified_email'])

        response = self.client.patch(self.url, {'key_expires_at': timezone.now()})
        self.assertEqual(response.data['key_expires_at'], original['key_expires_at'])

        response = self.client.patch(self.url, {'mail_verified': False})
        self.assertEqual(response.data['mail_verified'], True)


class TestEMailVerification(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.verified_user = VerifiedUserFactory()
        self.url = '/api/auth/verify_mail/'

    def test_verify_mail_succeeds(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url, {'key': self.user.activation_key})
        self.assertEqual(response.data, {})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_verify_mail_fails_if_not_logged_in(self):
        response = self.client.post(self.url, {'key': self.user.activation_key})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_verify_mail_fails_with_wrong_key(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url, {'key': 'w' * 40})
        self.assertEqual(response.data, {'key': ['Key is invalid']})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_mail_fails_if_key_too_old(self):
        self.client.force_login(user=self.user)
        backup = self.user.key_expires_at
        self.user.key_expires_at = timezone.now() - timedelta(days=1)
        self.user.save()
        response = self.client.post(self.url, {'key': self.user.activation_key})
        self.assertEqual(response.data, {'key': ['Key has expired']})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.user.key_expires_at = backup
        self.user.save()

    def test_verify_mail_fails_if_already_verified(self):
        self.client.force_login(user=self.verified_user)
        response = self.client.post(self.url, {'key': self.user.activation_key})
        self.assertEqual(response.data['detail'], 'Mail is already verified.')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_verify_mail_fails_without_key(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url)
        self.assertEqual(response.data, {'key': ['This field is required.']})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestResendEMailVerificationKey(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.verified_user = VerifiedUserFactory()
        self.url = '/api/auth/resend_verification/'
        mail.outbox = []

    def test_resend_verification_succeeds(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Please verify your email')
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertNotIn('Thank you for signing up', mail.outbox[0].body)

    def test_resend_verification_fails_if_already_verified(self):
        self.client.force_login(user=self.verified_user)
        response = self.client.post(self.url)
        self.assertEqual(response.data['detail'], 'Mail is already verified.')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_resend_verification_fails_if_not_logged_in(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
