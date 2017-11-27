from django.db import DataError
from django.db import IntegrityError
from django.test import TestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.stores.models import Store


class TestStoreModel(TestCase):
    def setUp(self):
        self.group = GroupFactory()

    def test_create_fails_if_name_too_long(self):
        with self.assertRaises(DataError):
            Store.objects.create(name='a' * 81, group=self.group)

    def test_create_store_with_same_name_fails(self):
        Store.objects.create(name='abcdef', group=self.group)
        with self.assertRaises(IntegrityError):
            Store.objects.create(name='abcdef', group=self.group)

    def test_create_store_with_same_name_in_different_groups_works(self):
        Store.objects.create(name='abcdef', group=self.group)
        Store.objects.create(name='abcdef', group=GroupFactory())
