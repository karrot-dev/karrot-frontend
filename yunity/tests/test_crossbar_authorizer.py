from django.core.cache import cache
from django.test import TestCase
from utils.crossbar import YunityAuthorizer
from utils.session import SharedSessionData


class TestCrossbarAuthorizer(TestCase):

    def setUp(self):
        self.s = YunityAuthorizer()
        self.session_data = SharedSessionData(False)
        self.session_data.r.flushall()

    def test_default(self):
        self.assertFalse(self.s.authorize('1234', 'yunity.misc', 'subscribe'))

    def test_public(self):
        self.assertTrue(self.s.authorize('1234', 'yunity.public.blub', 'subscribe'))

    def test_user_wrong(self):
        self.assertFalse(self.s.authorize('1234', 'yunity.user.23.bla', 'subscribe'))

    def test_user_right(self):
        self.session_data.set_user_session('1234', 23)
        self.assertTrue(self.s.authorize('1234', 'yunity.user.23.bla', 'subscribe'))

    def test_user_right_publish(self):
        self.session_data.set_user_session('1234', 23)
        self.assertFalse(self.s.authorize('1234', 'yunity.user.23.bla', 'publish'))
