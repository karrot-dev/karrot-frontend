from rest_framework import status
from rest_framework.test import APITestCase
from yunity.groups.factories import Group
from yunity.stores.factories import Store
from yunity.users.factories import UserFactory


class TestStoresAPIFilter(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/stores/'

        # two groups one store
        cls.member = UserFactory()
        cls.group = Group(members=[cls.member, ])
        cls.group2 = Group(members=[cls.member, ])
        cls.store = Store(group=cls.group)
        cls.store2 = Store(group=cls.group2)

    def test_filter_by_group(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.url, {'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.store.name)

        response = self.client.get(self.url, {'group': self.group2.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.store2.name)

    def test_search_name(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.url, {'search': self.store.name})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.store.name)

    def test_search_description(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.url, {'search': self.store.description})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.store.name)
