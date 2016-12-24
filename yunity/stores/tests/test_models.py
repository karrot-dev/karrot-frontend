from django.db import DataError
from django.test import TestCase

from yunity.groups.factories import Group
from yunity.stores.models import Store


class TestStoreModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.Group = Group()

    def test_create_fails_if_name_too_long(self):
        with self.assertRaises(DataError):
            Store.objects.create(name='a' * 81, group=self.Group)
