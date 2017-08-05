from django.test import TestCase

from foodsaving.conversations.models import Conversation


class TestGroupModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

    def test_create_fails_if_name_too_long(self):
        with self.assertRaises(TypeError):
            Conversation.objects.create(name='a' * 81)
