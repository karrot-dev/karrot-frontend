from django.test import TestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.stores.factories import StoreFactory
from foodsaving.stores.serializers import StoreSerializer


class TestStoreSerializer(TestCase):
    def setUp(self):
        self.group = GroupFactory()
        self.store = StoreFactory()

    def test_store_instantiation(self):
        serializer = StoreSerializer(self.store)
        self.assertEqual(serializer.data['name'], self.store.name)
