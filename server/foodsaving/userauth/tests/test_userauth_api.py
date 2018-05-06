import os
from datetime import timedelta
from unittest.mock import MagicMock

from anymail.exceptions import AnymailAPIError
from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.contrib import auth
from django.contrib.auth import get_user_model
from django.core import mail
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.pickups.factories import PickupDateFactory
from foodsaving.stores.factories import StoreFactory
from foodsaving.userauth.models import VerificationCode
from foodsaving.users.factories import UserFactory, VerifiedUserFactory
from foodsaving.utils import email_utils
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
        self.assertIn('Please verify your email', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.user_data['email']])
        self.assertIn('Thank you for signing up', mail.outbox[0].body)

        response = self.client.post(
            '/api/auth/',
            {'email': self.user_data['email'], 'password': self.user_data['password']}
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

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
        self.type = VerificationCode.ACCOUNT_DELETE
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
        self.url_user = '/api/auth/user/'
        self.url_delete = '/api/auth/user/?code={:s}'
        self.url_request_delete = '/api/auth/user/request_delete/'
        mail.outbox = []

    def test_request_deletion_succeeds(self):
        self.client.force_login(self.user)
        response = self.client.post(self.url_request_delete)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Request to delete your account', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.user.email])

    def test_request_deletion_fails_if_not_logged_in(self):
        response = self.client.post(self.url_request_delete)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(len(mail.outbox), 0)

    def test_request_deletion_twice_succeeds(self):
        self.client.force_login(self.user)
        self.client.post(self.url_request_delete)
        response = self.client.post(self.url_request_delete)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 2)
        codes = VerificationCode.objects.filter(user=self.user, type=VerificationCode.ACCOUNT_DELETE)
        self.assertEqual(codes.count(), 1)

    def test_delete_succeeds(self):
        self.assertEqual(self.pickupdate.collectors.count(), 1)
        self.assertEqual(self.past_pickupdate.collectors.count(), 1)

        self.client.force_login(self.user)
        self.client.post(self.url_request_delete)
        code = VerificationCode.objects.get(user=self.user, type=self.type).code
        response = self.client.delete(self.url_delete.format(code))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(self.group.members.get_queryset().filter(id=self.user.id).exists())
        self.assertFalse(self.pickupdate.collectors.get_queryset().filter(id=self.user.id).exists())
        self.assertTrue(self.past_pickupdate.collectors.get_queryset().filter(id=self.user.id).exists())

        self.assertEqual(len(mail.outbox), 2)
        self.assertIn('Account successfully deleted', mail.outbox[1].subject)
        self.assertEqual(mail.outbox[1].to, [self.user.email])

        self.assertEqual(get_user_model().objects.filter(email=self.user.email).count(), 0)

        # actions are disabled when user is deleted
        self.assertEqual(
            self.client.post('/api/auth/', {'email': self.user.email, 'password': self.user.display_name}).status_code,
            status.HTTP_400_BAD_REQUEST
        )
        self.assertEqual(
            self.client.post('/api/auth/password/reset/', {'email': self.user.email}).status_code,
            status.HTTP_400_BAD_REQUEST
        )

    def test_deletion_fails_without_verification_code(self):
        self.client.force_login(self.user)
        self.client.post(self.url_request_delete)
        response = self.client.delete(self.url_user)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'code': ['This field is required.']})
        self.assertEqual(len(mail.outbox), 1)

    def test_deletion_fails_with_previous_verification_code(self):
        self.client.force_login(self.user)
        self.client.post(self.url_request_delete)
        code = VerificationCode.objects.get(user=self.user, type=self.type).code
        self.client.post(self.url_request_delete)
        response = self.client.delete(self.url_delete.format(code))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['code'], ['Verification code is invalid'])
        self.assertEqual(len(mail.outbox), 2)

    def test_deletion_fails_if_verification_code_too_old(self):
        self.client.force_login(self.user)
        self.client.post(self.url_request_delete)
        verification_code = VerificationCode.objects.get(user=self.user, type=self.type)
        verification_code.created_at = timezone.now() - timedelta(days=8)
        verification_code.save()
        response = self.client.delete(self.url_delete.format(verification_code.code))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['code'], ['Verification code has expired'])
        self.assertEqual(len(mail.outbox), 1)


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


class TestUploadPhoto(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = '/api/auth/user/'
        self.photo_file = os.path.join(os.path.dirname(__file__), './photo.jpg')

    def test_upload_and_delete_photo(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertTrue('full_size' not in response.data['photo_urls'])

        with open(self.photo_file, 'rb') as photo:
            response = self.client.patch(self.url, {'photo': photo})
            self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(self.url)
        self.assertTrue('full_size' in response.data['photo_urls'])
        self.assertTrue('thumbnail' in response.data['photo_urls'])
        self.assertTrue(response.data['photo_urls']['full_size'].startswith('http://testserver'))

        # delete photo
        response = self.client.patch(self.url, {'photo': None}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

        response = self.client.get(self.url)
        self.assertTrue('full_size' not in response.data['photo_urls'])
        self.assertTrue('thumbnail' not in response.data['photo_urls'])


class TestRejectedAddress(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url_user = '/api/auth/user/'
        self.url_change_email = '/api/auth/password/'
        self.url_request_account_deletion = '/api/auth/user/request_delete/'

        # Mock AnymailMessage to throw error on send
        self.mail_class = email_utils.AnymailMessage
        self._original_send = self.mail_class.send
        self.mail_class.send = MagicMock(side_effect=AnymailAPIError())

    def tearDown(self):
        self.mail_class.send = self._original_send

    def test_sign_up_with_rejected_address_fails(self):
        response = self.client.post(self.url_user, {
            'email': 'bad@test.com',
            'password': faker.name(),
            'display_name': faker.name()
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)

    def test_change_to_rejected_address_fails(self):
        self.client.force_login(user=self.user)
        response = self.client.put(self.url_change_email, {'password': self.user.display_name,
                                                           'new_email': 'bad@test.com'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)

    def test_request_account_deletion_fails(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url_request_account_deletion)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        codes = VerificationCode.objects.filter(user=self.user, type=VerificationCode.ACCOUNT_DELETE)
        self.assertEqual(codes.count(), 0)

    def test_account_deletion_fails(self):
        self.client.force_login(user=self.user)
        code = VerificationCode.objects.create(user=self.user, type=VerificationCode.ACCOUNT_DELETE).code
        response = self.client.delete(self.url_user, {'code': code})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        codes = VerificationCode.objects.filter(user=self.user, type=VerificationCode.ACCOUNT_DELETE)
        self.assertEqual(codes.count(), 1)
        self.assertTrue(auth.get_user(self.client).is_authenticated)


class TestSetCurrentGroup(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.group = GroupFactory(members=[self.user, ])
        self.unrelated_group = GroupFactory()

    def test_set_current_group_succeeds(self):
        self.client.force_login(user=self.user)
        self.assertEqual(
            self.client.patch('/api/auth/user/', {'current_group': self.group.id}).status_code,
            status.HTTP_200_OK
        )

    def test_set_current_group_as_non_member_fails(self):
        self.client.force_login(user=self.user)
        self.assertEqual(
            self.client.patch('/api/auth/user/', {'current_group': self.unrelated_group.id}).status_code,
            status.HTTP_400_BAD_REQUEST
        )


class TestChangePassword(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = '/api/auth/password/'
        self.data = {'new_password': 'new_password', 'old_password': self.user.display_name}

    def test_change_succeeds(self):
        self.client.force_login(user=self.user)
        response = self.client.put(self.url, self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT, response)

        # User stays logged in
        self.assertTrue(auth.get_user(self.client).is_authenticated)

        # test new password
        self.client.logout()
        self.assertTrue(self.client.login(email=self.user.email, password='new_password'))

    def test_change_with_wrong_password_fails(self):
        self.client.force_login(user=self.user)
        data = {'new_password': self.data['new_password'], 'old_password': 'this_is_wrong'}
        response = self.client.put(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response)
        self.assertTrue(self.client.login(email=self.user.email, password=self.user.display_name))

    def test_change_at_user_endpoint_has_no_effect(self):
        self.client.force_login(user=self.user)
        data = self.client.get('/api/auth/user/').data
        data['password'] = 'really_new_shiny'
        self.client.patch('/api/auth/user/', data, format='json')
        self.assertTrue(self.client.login(email=self.user.email, password=self.user.display_name))


class TestChangeEMail(APITestCase):
    def setUp(self):
        self.verified_user = VerifiedUserFactory()
        self.another_user = VerifiedUserFactory()
        self.old_email = self.verified_user.email
        self.new_email = faker.email()
        self.password = self.verified_user.display_name
        self.url = '/api/auth/email/'
        self.url_patch = '/api/auth/user/'
        mail.outbox = []

    def test_patch_fails(self):
        self.client.force_login(user=self.verified_user)
        self.assertTrue(self.verified_user.mail_verified)

        # typical frontend use case of getting, modifying and sending data
        data = self.client.get(self.url_patch).data
        data['email'] = self.new_email
        response = self.client.patch(self.url_patch, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(self.verified_user.email, self.verified_user.unverified_email)
        self.assertEqual(response.data['email'], self.old_email)
        self.assertEqual(len(mail.outbox), 0)

    def test_change_succeeds(self):
        self.client.force_login(user=self.verified_user)
        self.assertTrue(self.verified_user.mail_verified)

        response = self.client.put(self.url, {'password': self.password, 'new_email': self.new_email})

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 2)
        self.assertIn('Your email address changed', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.old_email], 'error: change notice sent to wrong address')
        self.assertIn('Please verify your email', mail.outbox[1].subject)
        self.assertEqual(
            mail.outbox[1].to,
            [self.new_email],
            'error: verification request sent to wrong address'
        )
        self.assertNotIn('Thank you for signing up', mail.outbox[1].body)

        self.verified_user.refresh_from_db()
        self.assertFalse(self.verified_user.mail_verified)
        self.assertEqual(self.verified_user.email, self.old_email)
        self.assertEqual(self.verified_user.unverified_email, self.new_email)

        self.verified_user.verify_mail()
        self.verified_user.refresh_from_db()
        self.assertTrue(self.verified_user.mail_verified)
        self.assertEqual(self.verified_user.email, self.new_email)
        response = self.client.get(self.url_patch)
        self.assertEqual(response.data['email'], self.new_email)

    def test_change_without_password_fails(self):
        self.client.force_login(user=self.verified_user)
        response = self.client.put(self.url, {'new_email': self.new_email})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        response = self.client.put(self.url, {'password': '', 'new_email': self.new_email})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)

    def test_change_with_wrong_password_fails(self):
        self.client.force_login(user=self.verified_user)
        response = self.client.put(self.url, {'password': 'wrong', 'new_email': self.new_email})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)

    def test_change_to_existing_mail_fails(self):
        self.client.force_login(user=self.verified_user)
        response = self.client.put(self.url, {'password': self.password, 'new_email': self.another_user.email})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(mail.outbox), 0)

    def test_change_to_existing_similar_mail_fails(self):
        self.client.force_login(user=self.verified_user)
        similar_mail = self.another_user.email[0].swapcase() + self.another_user.email[1:]
        response = self.client.put(self.url, {'password': self.password, 'new_email': similar_mail})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['new_email'], ['Similar e-mail exists: ' + self.another_user.email])
        self.assertEqual(len(mail.outbox), 0)

    def test_change_to_similar_mail_succeeds(self):
        self.client.force_login(user=self.verified_user)
        similar_mail = self.verified_user.email[0].swapcase() + self.verified_user.email[1:]
        response = self.client.put(self.url, {'password': self.password, 'new_email': similar_mail})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 2)

    def test_restore_email_succeeds(self):
        self.client.force_login(user=self.verified_user)

        response = self.client.put(self.url, {'password': self.password, 'new_email': self.new_email})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 2)
        mail.outbox.clear()

        response = self.client.put(self.url, {'password': self.password, 'new_email': self.old_email})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 0)
        self.assertEqual(self.verified_user.email, self.old_email)
        self.assertEqual(self.verified_user.unverified_email, self.old_email)
        self.assertTrue(self.verified_user.mail_verified)

    def test_dont_change_email(self):
        self.client.force_login(user=self.verified_user)
        response = self.client.put(self.url, {'password': self.password, 'new_email': self.old_email})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 0)

    def test_changing_sensitive_fields_is_forbidden(self):
        self.client.force_login(user=self.verified_user)
        response = self.client.get(self.url_patch)
        original = response.data

        response = self.client.patch(self.url_patch, {'unverified_email': faker.email()})
        self.assertEqual(response.data['unverified_email'], original['unverified_email'])

        response = self.client.patch(self.url_patch, {'mail_verified': False})
        self.assertEqual(response.data['mail_verified'], True)


class TestEMailVerification(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.url = '/api/auth/email/verify/'
        self.type = VerificationCode.EMAIL_VERIFICATION

    def test_verify_mail_succeeds(self):
        code = VerificationCode.objects.get(user=self.user, type=self.type).code
        response = self.client.post(self.url, {'code': code})
        self.assertEqual(response.data, {})
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_verify_mail_fails_with_wrong_verification_code(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url, {'code': 'w' * 40})
        self.assertEqual(response.data['code'], ['Verification code is invalid'])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_mail_fails_if_verification_code_too_old(self):
        verification_code = VerificationCode.objects.get(user=self.user, type=self.type)
        backup = verification_code.created_at
        verification_code.created_at = timezone.now() - timedelta(days=8)
        verification_code.save()
        response = self.client.post(self.url, {'code': verification_code.code})
        self.assertEqual(response.data['code'], ['Verification code has expired'])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        verification_code.created_at = backup
        verification_code.save()

    def test_verify_mail_fails_if_already_verified(self):
        code = VerificationCode.objects.get(user=self.user, type=VerificationCode.EMAIL_VERIFICATION).code
        self.client.post(self.url, {'code': code})
        response = self.client.post(self.url, {'code': code})
        self.assertEqual(response.data['code'], ['Verification code is invalid'])
        # We send an HTTP_400_BAD_REQUEST instead of an HTTP_403_FORBIDDEN simply because
        # if the user is not logged in, we cannot identify him/her
        # (we delete verification codes right after usage).
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_mail_fails_without_verification_code(self):
        response = self.client.post(self.url)
        self.assertEqual(response.data, {'code': ['This field is required.']})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestResendEMailVerificationCode(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.verified_user = VerifiedUserFactory()
        self.url = '/api/auth/email/resend_verification_code/'
        mail.outbox = []

    def test_resend_mail_verification_code_succeeds(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn('Please verify your email', mail.outbox[0].subject)
        self.assertEqual(mail.outbox[0].to, [self.user.email])
        self.assertNotIn('Thank you for signing up', mail.outbox[0].body)

    def test_resend_mail_verification_code_fails_if_already_verified(self):
        self.client.force_login(user=self.verified_user)
        response = self.client.post(self.url)
        self.assertEqual(response.data['detail'], 'Mail is already verified.')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_resend_mail_verification_code_fails_if_not_logged_in(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
