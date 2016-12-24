from django.db import DataError
from django.test import TestCase

from yunity.groups.models import Group


class TestGroupModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

    def test_create_fails_if_name_too_long(self):
        with self.assertRaises(DataError):
            Group.objects.create(name='a' * 81)
