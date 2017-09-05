from unittest.mock import MagicMock

from anymail.exceptions import AnymailAPIError
from django.contrib.auth import get_user_model
from django.db import DataError
from django.db import IntegrityError
from django.test import TestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.users import models
from foodsaving.users.factories import UserFactory
from foodsaving.utils.tests.fake import faker


class TestUserModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = UserFactory()
        cls.group = GroupFactory(members=[cls.user, ])
        cls.exampleuser = {
            'display_name': 'bla',
            'email': 'user@example.com',
            'password': 'notsafe',
            'current_group': cls.group,
        }

    def test_create_fails_if_email_is_not_unique(self):
        get_user_model().objects.create_user(**self.exampleuser)
        with self.assertRaises(IntegrityError):
            get_user_model().objects.create_user(**self.exampleuser)

    def test_create_fails_if_name_too_long(self):
        with self.assertRaises(DataError):
            too_long = self.exampleuser
            too_long['display_name'] = 'a' * 81
            get_user_model().objects.create_user(**too_long)

    def test_user_representation(self):
        r = repr(self.user)
        self.assertTrue(self.user.display_name in r)

    def test_create_fails_if_default_language_is_not_set(self):
        default_language = get_user_model().objects.create_user(**self.exampleuser).language
        self.assertEqual(default_language, 'en')

    def test_create_superuser(self):
        email = faker.email()
        get_user_model().objects.create_superuser(email, 'letmein')
        self.assertEqual(get_user_model().objects.filter(email=email).count(), 1)

    def test_create_user_without_specify_email(self):
        with self.assertRaisesMessage(ValueError, 'The email field must be set'):
            get_user_model().objects.create_user(None, 'foo')

    def test_get_short_name(self):
        user = UserFactory()
        self.assertEqual(user.get_short_name(), user.display_name)

    def test_superusers_have_all_perms(self):
        email = faker.email()
        superuser = get_user_model().objects.create_superuser(email, 'foo')
        self.assertTrue(superuser.has_perm('eating horses'))
        self.assertTrue(superuser.has_perm('eating this specific horse', 'I am a kind and gentle horse'))
        self.assertTrue(superuser.has_module_perms('lunar'))

    def test_normal_users_have_no_perms(self):
        email = faker.email()
        user = get_user_model().objects.create_user(email, 'foo', display_name='I am normal')
        self.assertFalse(user.has_perm('eating horses'))
        self.assertFalse(user.has_perm('eating this specific horse', 'I am a kind and gentle horse'))
        self.assertFalse(user.has_module_perms('lunar'))


class TestSendMail(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.mail_class = models.AnymailMessage
        cls._original_send = cls.mail_class.send
        cls.mail_class.send = MagicMock(side_effect=AnymailAPIError())

    @classmethod
    def tearDownClass(cls):
        super().tearDownClass()
        cls.mail_class.send = cls._original_send

    def test_send_to_fake_email(self):
        with self.assertRaises(AnymailAPIError):
            get_user_model().objects.create_user(
                email='shabab@test.com',
                password='123',
                display_name='lalala'
            )
        self.assertEqual(get_user_model().objects.filter(email='shabab@test.com').count(), 0)
