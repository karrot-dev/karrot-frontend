from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase


class TestUserModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.exampleuser = {
            'display_name': 'bla',
            'email': 'user@example.com',
            'password': 'notsafe'
        }

    def test_create_fails_if_email_is_not_unique(self):
        get_user_model().objects.create_user(**self.exampleuser)
        with self.assertRaises(IntegrityError):
            get_user_model().objects.create_user(**self.exampleuser)