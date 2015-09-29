from django.test import TestCase
from utils.session import SharedSessionData


class TestSharedSession(TestCase):

    def test_session_key(self):
        s = SharedSessionData(True)
        self.assertEqual(s.session_key('123'), 'session-store-123')

    def test_set_get_standalone(self):
        s = SharedSessionData(False)
        s.set_user_session('123', 3)
        self.assertEqual(s.get_user_by_session('123'), '3')

    def test_set_get_django_redis(self):
        s = SharedSessionData(True)
        s.set_user_session('123', 3)
        self.assertEqual(s.get_user_by_session('123'), '3')
