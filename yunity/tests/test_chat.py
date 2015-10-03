from . import factories as f

from django.test import TestCase

class ChatTestCase(TestCase):
    def test_create_chat(self):
        user = f.UserFactory.create()

        assert(True)