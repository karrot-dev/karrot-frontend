from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.groups.models import GroupMembership
from foodsaving.users.factories import UserFactory


class TestStoresAPIFilter(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/users/'

        cls.user = UserFactory()
        cls.user2 = UserFactory()
        cls.group = GroupFactory()
        GroupMembership.objects.create(group=cls.group, user=cls.user)
        GroupMembership.objects.create(group=cls.group, user=cls.user2)

    def test_search_display_name(self):
        self.client.force_login(user=self.user2)
        response = self.client.get(self.url, {'search': self.user.display_name})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['display_name'], self.user.display_name)
