from django.test import TestCase

from foodsaving.users.factories import UserFactory
from foodsaving.userauth.models import VerificationCode


class TestVerificationCodeModel(TestCase):
    def setUp(self):
        self.user = UserFactory()

    def test_verification_code(self):
        loaded_code = VerificationCode.objects.get(user=self.user)
        self.assertFalse(loaded_code.has_expired())
