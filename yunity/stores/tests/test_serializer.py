from django.test import TestCase
from yunity.groups.factories import Group
from yunity.stores.factories import Store, PickupDate
from yunity.stores.serializers import StoreSummarySerializer


class TestStoreSummarySerializer(TestCase):

    @classmethod
    def setUpClass(cls):
        super(TestStoreSummarySerializer, cls).setUpClass()
        cls.group = Group()
        cls.store = Store()

    def test_store_instantiation(self):
        serializer = StoreSummarySerializer(self.store)
        self.assertEqual(serializer.data['name'], self.store.name)
        self.assertEqual(len(serializer.data['pickups']), 0)

    def test_storesummary_pickups(self):
        PickupDate(store=self.store)
        serializer = StoreSummarySerializer(self.store)
        self.assertEqual(len(serializer.data['pickups']), 1)
