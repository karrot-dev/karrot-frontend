from rest_framework import status
from rest_framework.test import APITestCase
from yunity.groups.factories import Group as GroupFactory
from yunity.groups.models import Group as GroupModel
from yunity.users.factories import User


class TestGroupsAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User()
        cls.group = GroupFactory()
        cls.url = '/api/groups/'

    def test_create_group(self):
        self.client.force_login(user=self.user)
        data = {'name': 'random_name', 'description': 'still alive'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], data['name'])
        self.assertEqual(GroupModel.objects.get(name=data['name']).description, data['description'])

    def test_create_group_fails_if_not_logged_in(self):
        data = {'name': 'random_name', 'description': 'still alive'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_groups(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_groups_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_join_group(self):
        self.client.force_login(user=self.user)
        response = self.client.post('/api/groups/1/join/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_join_group_fails_if_not_logged_in(self):
        response = self.client.post('/api/groups/1/join/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_leave_group(self):
        self.client.force_login(user=self.user)
        self.group.members.add(self.user)
        response = self.client.post('/api/groups/1/leave/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leave_group_fails_if_not_logged_in(self):
        self.group.members.add(self.user)
        response = self.client.post('/api/groups/1/leave/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)