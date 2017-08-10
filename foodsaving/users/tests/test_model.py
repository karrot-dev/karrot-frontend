from unittest.mock import MagicMock

from anymail.exceptions import AnymailAPIError
from django.contrib.auth import get_user_model
from django.db import DataError
from django.db import IntegrityError
from django.test import TestCase

from foodsaving.users import models
from foodsaving.users.factories import UserFactory
from foodsaving.groups.factories import GroupFactory


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

    def test_create_user_with_case_sensitive_email_address(self):
        start = get_user_model().objects.count()
        get_user_model().objects.create_user(
            display_name='a',
            email='fancy@example.com',
            password='123'
        )
        with self.assertRaises(IntegrityError):
            get_user_model().objects.create_user(
                display_name='a',
                email='Fancy@example.com',
                password='123'
            )
        self.assertEqual(get_user_model().objects.count(), start + 1)


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



