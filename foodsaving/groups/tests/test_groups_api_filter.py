from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.users.factories import UserFactory


class TestGroupsInfoAPIFilter(APITestCase):
    def setUp(self):
        self.url = '/api/groups-info/'

        # some user
        self.user = UserFactory()

        # two groups with different members
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member, ])
        self.member2 = UserFactory()
        self.group2 = GroupFactory(members=[self.member2, ])
        self.empty_group = GroupFactory()

    def test_filter_by_member(self):
        response = self.client.get(self.url, {'members': self.member.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.group.name)

        response = self.client.get(self.url, {'members': self.member.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.group.name)

    def test_dont_include_empty(self):
        response = self.client.get(self.url, {'include_empty': False})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        group_ids = [_['id'] for _ in response.data]
        self.assertIn(self.group.id, group_ids)
        self.assertIn(self.group2.id, group_ids)
        self.assertNotIn(self.empty_group.id, group_ids)

    def test_include_empty(self):
        response = self.client.get(self.url, {'include_empty': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        group_ids = [_['id'] for _ in response.data]
        self.assertIn(self.group.id, group_ids)
        self.assertIn(self.group2.id, group_ids)
        self.assertIn(self.empty_group.id, group_ids)

    def test_search_name(self):
        response = self.client.get(self.url, {'search': self.group.name})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.group.name)

    def test_search_description(self):
        response = self.client.get(self.url, {'search': self.group.public_description})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], self.group.name)
