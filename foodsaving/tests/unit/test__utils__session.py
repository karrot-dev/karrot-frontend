from django.test import TestCase

from foodsaving.utils.session import RealtimeClientData


class TestSharedSession(TestCase):

    def test_session_key(self):
        self.assertEqual(RealtimeClientData.session_key('123'), 'session-store-123')

    def test_set_get_django_redis(self):
        RealtimeClientData.set_user_session('123', 3)
        self.assertEqual(RealtimeClientData.get_user_by_session('123'), '3')
        RealtimeClientData.set_user_session('123', 4)
        self.assertEqual(RealtimeClientData.get_user_by_session('123'), '4')

    def test_integration_data_to_users(self):
        """ This is a RealtimeClient integration test.

        For current implementation, subscribe to the notifications topic to see it working:
        redis-cli subscribe notifications
        """
        RealtimeClientData.set_user_session('123', 3)
        RealtimeClientData.send_to_users(
            [3], RealtimeClientData.Types.CONVERSATION_MESSAGE, {'msg': 'hello'})
