from django.test import TestCase
from yunity.groups.factories import Group
from yunity.stores.factories import Store
from yunity.stores.serializers import StoreSummarySerializer


class TestStoreSummarySerializer(TestCase):
    @classmethod
    def setUpClass(cls):
        super(TestStoreSummarySerializer, cls).setUpClass()
        cls.group = Group()
        cls.store = Store()

    def test_empty_store_instantiation(self):
        serializer = StoreSummarySerializer(self.store)
