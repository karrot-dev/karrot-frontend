from django.contrib.auth import get_user_model
from django.db import DataError
from django.db import IntegrityError
from django.test import TestCase

from foodsaving.users.factories import UserFactory
from foodsaving.groups.factories import GroupFactory
from foodsaving.users.models import User


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
        self.assertTrue(default_language, 'en-us')


