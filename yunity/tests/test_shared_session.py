from django.test import TestCase

from yunity.utils.session import RealtimeClientData


class TestSharedSession(TestCase):

    def test_session_key(self):
        self.assertEqual(RealtimeClientData.session_key('123'), 'session-store-123')

    def test_set_get_django_redis(self):
        RealtimeClientData.set_user_session('123', 3)
        self.assertEqual(RealtimeClientData.get_user_by_session('123'), '3')
        RealtimeClientData.set_user_session('123', 4)
        self.assertEqual(RealtimeClientData.get_user_by_session('123'), '4')
