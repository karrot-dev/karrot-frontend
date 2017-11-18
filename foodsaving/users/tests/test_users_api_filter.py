from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.groups.models import GroupMembership
from foodsaving.users.factories import UserFactory


class TestStoresAPIFilter(APITestCase):
    def setUp(self):
        self.url = '/api/users/'

        self.user = UserFactory()
        self.user2 = UserFactory()
        self.group = GroupFactory()
        GroupMembership.objects.create(group=self.group, user=self.user)
        GroupMembership.objects.create(group=self.group, user=self.user2)

    def test_search_display_name(self):
        self.client.force_login(user=self.user2)
        response = self.client.get(self.url, {'search': self.user.display_name})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['display_name'], self.user.display_name)
