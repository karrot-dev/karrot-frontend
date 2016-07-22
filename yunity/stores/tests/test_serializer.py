from django.test import TestCase
from yunity.groups.factories import Group
from yunity.stores.factories import Store
from yunity.stores.serializers import StoreSerializer


class TestStoreSerializer(TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.group = Group()
        cls.store = Store()

    def test_store_instantiation(self):
        serializer = StoreSerializer(self.store)
        self.assertEqual(serializer.data['name'], self.store.name)
