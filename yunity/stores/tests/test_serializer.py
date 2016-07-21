from django.test import TestCase
from yunity.groups.factories import Group
from yunity.stores.factories import Store, PickupDate
from yunity.stores.serializers import StoreSerializer
from django.utils import timezone


class TestStoreSerializer(TestCase):

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.group = Group()
        cls.store = Store()

    def test_store_instantiation(self):
        serializer = StoreSerializer(self.store)
        self.assertEqual(serializer.data['name'], self.store.name)
        self.assertEqual(len(serializer.data['pickups']), 0)

    def test_storesummary_pickups(self):
        PickupDate(store=self.store, date=timezone.now())
        serializer = StoreSerializer(self.store)
        self.assertEqual(len(serializer.data['pickups']), 1)
