from django.test import TestCase
from foodsaving.groups.factories import Group
from foodsaving.stores.factories import Store
from foodsaving.stores.serializers import StoreSerializer


class TestStoreSerializer(TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.group = Group()
        cls.store = Store()

    def test_store_instantiation(self):
        serializer = StoreSerializer(self.store)
        self.assertEqual(serializer.data['name'], self.store.name)
