from rest_framework import status
from rest_framework.test import APITestCase
from yunity.groups.factories import Group as GroupFactory
from yunity.groups.models import Group as GroupModel
from yunity.users.factories import User
from yunity.utils.tests.fake import faker


class TestGroupsAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User()
        cls.member = User()
        cls.group = GroupFactory(members=[cls.member, ])
        cls.group_with_password = GroupFactory(password='abc')
        cls.join_password_url = '/api/groups/{}/join/'.format(cls.group_with_password.id)
        cls.url = '/api/groups/'
        cls.group_data = {'name': faker.name(),
                          'description': faker.text(),
                          'address': faker.address(),
                          'latitude': faker.latitude(),
                          'longitude': faker.longitude()}

    def test_create_group(self):
        self.client.force_login(user=self.user)
        data = {'name': 'random_name', 'description': 'still alive'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], data['name'])
        self.assertEqual(GroupModel.objects.get(name=data['name']).description, data['description'])

    def test_create_group_with_location(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url, self.group_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], self.group_data['name'])
        self.assertEqual(GroupModel.objects.get(name=self.group_data['name']).description,
                         self.group_data['description'])
        self.assertEqual(response.data['address'], self.group_data['address'])

    def test_create_group_fails_if_not_logged_in(self):
        data = {'name': 'random_name', 'description': 'still alive'}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_groups(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_groups_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse('password' in response.data)

    def test_retrieve_group(self):
        url = self.url + str(self.group.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_group_as_user(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.group.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse('password' in response.data)

    def test_retrieve_group_as_member(self):
        self.client.force_login(user=self.member)
        url = self.url + str(self.group.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('password' in response.data)

    def test_patch_group(self):
        url = self.url + str(self.group.id) + '/'
        response = self.client.patch(url, self.group_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_group_as_user(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.group.id) + '/'
        response = self.client.patch(url, self.group_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_group_as_member(self):
        self.client.force_login(user=self.member)
        url = self.url + str(self.group.id) + '/'
        response = self.client.patch(url, self.group_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_group(self):
        url = self.url + str(self.group.id) + '/'
        response = self.client.put(url, self.group_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_put_group_as_user(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.group.id) + '/'
        response = self.client.put(url, self.group_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_put_group_as_member(self):
        self.client.force_login(user=self.member)
        url = self.url + str(self.group.id) + '/'
        response = self.client.put(url, self.group_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_join_group(self):
        self.client.force_login(user=self.user)
        response = self.client.post('/api/groups/1/join/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_join_group_with_password(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.join_password_url, {"password": "abc"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_join_group_with_password_fails_if_wrong(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.join_password_url, {"password": "wrong"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_join_group_with_password_fails_if_empty(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.join_password_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_join_group_fails_if_not_logged_in(self):
        response = self.client.post('/api/groups/1/join/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_leave_group(self):
        self.client.force_login(user=self.member)
        response = self.client.post('/api/groups/1/leave/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leave_group_fails_if_not_logged_in(self):
        response = self.client.post('/api/groups/1/leave/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_group(self):
        url = self.url + str(self.group.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_group_as_user(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.group.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_group_as_member(self):
        self.client.force_login(user=self.member)
        url = self.url + str(self.group.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
