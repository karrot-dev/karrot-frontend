from django.db import DataError
from django.db import IntegrityError
from django.test import TestCase

from foodsaving.conversations.models import Conversation


class TestGroupModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

    def test_create_fails_if_name_too_long(self):
        with self.assertRaises(DataError):
            Conversation.objects.create(name='a' * 81)
