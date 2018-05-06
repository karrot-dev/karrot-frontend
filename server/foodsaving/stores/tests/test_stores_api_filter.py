from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.stores.factories import StoreFactory
from foodsaving.users.factories import UserFactory


class TestStoresAPIFilter(APITestCase):
    def setUp(self):
        self.url = '/api/stores/'

        # two groups one store
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member, ])
        self.group2 = GroupFactory(members=[self.member, ])
        self.store = StoreFactory(group=self.group)
        self.store2 = StoreFactory(group=self.group2)

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
