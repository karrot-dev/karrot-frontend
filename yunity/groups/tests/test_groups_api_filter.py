from rest_framework import status
from rest_framework.test import APITestCase
from yunity.groups.factories import Group
from yunity.users.factories import User


class TestStoresAPIFilter(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/groups/'

        # some user
        cls.user = User()

        # two groups with different members
        cls.member = User()
        cls.group = Group(members=[cls.member, ])
        cls.member2 = User()
        cls.group2 = Group(members=[cls.member2, ])

    def test_filter_by_member(self):
        response = self.client.get(self.url, {'members': self.member.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.group.name)

        response = self.client.get(self.url, {'members': self.member.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.group.name)

    def test_search_name(self):
        response = self.client.get(self.url, {'search': self.group.name})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.group.name)

    def test_search_description(self):
        response = self.client.get(self.url, {'search': self.group.description})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.group.name)
