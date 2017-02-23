from datetime import timedelta

from dateutil.relativedelta import relativedelta
from django.contrib.auth import get_user_model
from django.core import mail
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from config import settings
from foodsaving.groups.factories import Group as GroupFactory
from foodsaving.stores.factories import PickupDate as PickupDateFactory, Store as StoreFactory
from foodsaving.users.factories import UserFactory, VerifiedUserFactory
from foodsaving.utils.tests.fake import faker


class TestUserDeleteAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = UserFactory()
        cls.group = GroupFactory(members=[cls.user, ])
        cls.store = StoreFactory(group=cls.group)
        cls.pickupdate = PickupDateFactory(
            store=cls.store,
            date=timezone.now() + relativedelta(days=1),
            collectors=[cls.user, ])
        cls.past_pickupdate = PickupDateFactory(
            store=cls.store,
            date=timezone.now() - relativedelta(days=1),
            collectors=[cls.user, ]
        )
        cls.url = '/api/users/{}/'.format(cls.user.id)

    def test_delete_user(self):
        self.assertEqual(self.group.members.count(), 1)
        self.assertEqual(self.pickupdate.collectors.count(), 1)
        self.assertEqual(self.past_pickupdate.collectors.count(), 1)

        self.client.force_login(self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertFalse(self.group.members.get_queryset().filter(id=self.user.id).exists())
        self.assertFalse(self.pickupdate.collectors.get_queryset().filter(id=self.user.id).exists())
        self.assertTrue(self.past_pickupdate.collectors.get_queryset().filter(id=self.user.id).exists())

        # delete another user
        u2 = UserFactory()
        self.client.force_login(u2)
        url = '/api/users/{}/'.format(u2.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TestUsersAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = UserFactory()
        cls.user2 = UserFactory()
        cls.verified_user = VerifiedUserFactory()
        cls.url = '/api/users/'
        cls.user_data = {
            'email': faker.email(),
            'password': faker.name(),
            'display_name': faker.name(),
            'address': faker.address(),
            'latitude': faker.latitude(),
            'longitude': faker.longitude()
        }
        cls.group = GroupFactory(members=[cls.user, cls.user2])
        cls.another_common_group = GroupFactory(members=[cls.user, cls.user2])
        cls.user_in_another_group = UserFactory()
        cls.another_group = GroupFactory(members=[cls.user_in_another_group, ])

    def test_create_user(self):
        response = self.client.post(self.url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], self.user_data['email'])
        self.assertAlmostEqual(response.data['latitude'], float(self.user_data['latitude']))
        self.assertEqual(response.data['description'], '')
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Verify your mail address')
        self.assertEqual(mail.outbox[0].to, [self.user_data['email']])

    def test_list_users_forbidden(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_users_allowed(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_retrieve_user_forbidden(self):
        url = self.url + str(self.user.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_user_allowed(self):
        self.client.force_login(user=self.user2)
        url = self.url + str(self.user.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], self.user.description)

    def test_retrieve_user_in_another_group_fails(self):
        self.client.force_login(user=self.user2)
        url = self.url + str(self.user_in_another_group.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_verify_mail_succeeds(self):
        self.client.force_login(user=self.user)
        url = self.url + 'verify_mail/'
        response = self.client.post(url, {'key': self.user.activation_key})
        self.assertEqual(response.data, None)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_verify_mail_fails_if_not_logged_in(self):
        url = self.url + 'verify_mail/'
        response = self.client.post(url, {'key': self.user.activation_key})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_verify_mail_fails_with_wrong_key(self):
        self.client.force_login(user=self.user)
        url = self.url + 'verify_mail/'
        response = self.client.post(url, {'key': 'w' * 40})
        self.assertEqual(response.data, {'key': ['Key is invalid']})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_mail_fails_if_key_too_old(self):
        self.client.force_login(user=self.user)
        url = self.url + 'verify_mail/'
        backup = self.user.key_expires_at
        self.user.key_expires_at = timezone.now() - timedelta(days=1)
        self.user.save()
        response = self.client.post(url, {'key': self.user.activation_key})
        self.assertEqual(response.data, {'key': ['Key has expired']})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.user.key_expires_at = backup
        self.user.save()

    def test_verify_mail_fails_if_already_verified(self):
        self.client.force_login(user=self.verified_user)
        url = self.url + 'verify_mail/'
        response = self.client.post(url, {'key': self.user.activation_key})
        self.assertEqual(response.data, {'error': 'mail is already verified'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_mail_fails_without_key(self):
        self.client.force_login(user=self.user)
        url = self.url + 'verify_mail/'
        response = self.client.post(url)
        self.assertEqual(response.data, {'key': ['This field is required.']})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_resend_verification_succeeds(self):
        self.client.force_login(user=self.user)
        url = self.url + 'resend_verification/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Verify your mail address')
        self.assertEqual(mail.outbox[0].to, [self.user.email])

    def test_resend_verification_fails_if_already_verified(self):
        self.client.force_login(user=self.verified_user)
        url = self.url + 'resend_verification/'
        response = self.client.post(url)
        self.assertEqual(response.data, {'error': 'Already verified'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_resend_verification_fails_if_not_logged_in(self):
        url = self.url + 'resend_verification/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_reset_password_succeeds(self):
        url = self.url + 'reset_password/'
        response = self.client.post(url, {'email': self.verified_user.email})
        self.assertIsNone(response.data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'New password')
        self.assertEqual(mail.outbox[0].to, [self.verified_user.email])

    def test_reset_password_fails_if_mail_not_verified(self):
        url = self.url + 'reset_password/'
        response = self.client.post(url, {'email': self.user.email})
        self.assertEqual(response.data, {'error': 'mail is not verified'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_password_fails_if_wrong_mail(self):
        url = self.url + 'reset_password/'
        response = self.client.post(url, {'email': 'wrong@example.com'})
        self.assertIsNone(response.data)
        # don't leak out validity of mail addresses, therefore return success
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_reset_password_fails_if_no_email(self):
        url = self.url + 'reset_password/'
        response = self.client.post(url)
        self.assertEqual(response.data, {'error': 'mail address is not provided'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_patch_user_forbidden(self):
        url = self.url + str(self.user.id) + '/'
        response = self.client.patch(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_different_user_forbidden(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user2.id) + '/'
        response = self.client.patch(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_self_allowed(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user.id) + '/'
        response = self.client.patch(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_only_description(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user.id) + '/'
        response = self.client.patch(url, {'description': ' test'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['description'], ' test')

    def test_patch_too_long_description(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user.id) + '/'
        response = self.client.patch(url, {'description': 'ab' * settings.DESCRIPTION_MAX_LENGTH}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_remove_user_forbidden(self):
        url = self.url + str(self.user.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_remove_different_user_forbidden(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user2.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_self_allowed(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)


class TestChangePassword(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = UserFactory()
        cls.url = '/api/users/'
        cls.data = {'password': 'new_password'}

    def test_change_with_patch_succeeds(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user.id) + '/'
        response = self.client.patch(url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # logged out
        response = self.client.patch(url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # test new password
        self.assertTrue(self.client.login(email=self.user.email, password='new_password'))

    def test_change_with_all_data_succeeds(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user.id) + '/'

        # typical frontend use case of getting, modifying and sending data
        data = self.client.get(url).data
        data['password'] = 'really_new_shiny'
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # logged out
        response = self.client.patch(url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # test new password
        self.assertTrue(self.client.login(email=self.user.email, password='really_new_shiny'))


class TestChangeMail(APITestCase):
    @classmethod
    def setUpTestData(cls):
        super().setUpTestData()
        cls.verified_user = VerifiedUserFactory()
        cls.another_user = VerifiedUserFactory()
        cls.url = '/api/users/'
        cls.user_url = cls.url + str(cls.verified_user.id) + '/'

    def test_change_with_patch_succeeds(self):
        self.client.force_login(user=self.verified_user)
        self.assertTrue(self.verified_user.mail_verified)

        # typical frontend use case of getting, modifying and sending data
        data = self.client.get(self.user_url).data
        data['email'] = faker.email()
        response = self.client.patch(self.user_url, data, format='json')
        user = get_user_model().objects.get(id=self.verified_user.id)

        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['email'], self.verified_user.email)
        self.assertFalse(user.mail_verified)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Verify your mail address')
        self.assertEqual(mail.outbox[0].to, [data['email']])

        user.verify_mail()
        self.assertTrue(user.mail_verified)
        response = self.client.get(self.user_url)
        self.assertEqual(response.data['email'], data['email'])

    def test_change_to_existing_mail_fails(self):
        self.client.force_login(user=self.verified_user)
        data = {'email': self.another_user.email}
        response = self.client.patch(self.user_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)
