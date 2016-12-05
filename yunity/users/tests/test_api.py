from rest_framework import status
from rest_framework.test import APITestCase

from yunity.groups.factories import Group
from yunity.users.factories import User
from yunity.utils.tests.fake import faker


class TestUsersAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.user = User()
        cls.user2 = User()
        cls.url = '/api/users/'
        cls.user_data = {'display_name': faker.name(),
                         'first_name': faker.name(),
                         'last_name': faker.name(),
                         'email': faker.email(),
                         'password': faker.name(),
                         'address': faker.address(),
                         'latitude': faker.latitude(),
                         'longitude': faker.longitude()}
        cls.group = Group()
        cls.group.members.add(cls.user)
        cls.group.members.add(cls.user2)
        cls.user_in_another_group = User()
        cls.another_group = Group()
        cls.another_group.members.add(cls.user_in_another_group)

    def test_create_user(self):
        response = self.client.post(self.url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], self.user_data['email'])
        self.assertAlmostEqual(response.data['latitude'], float(self.user_data['latitude']))

    def test_list_users_forbidden(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_users_allowed(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_retrieve_user_forbidden(self):
        url = self.url + str(self.user.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_user_allowed(self):
        self.client.force_login(user=self.user2)
        url = self.url + str(self.user.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_user_in_another_group_fails(self):
        self.client.force_login(user=self.user2)
        url = self.url + str(self.user_in_another_group.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_user_forbidden(self):
        url = self.url + str(self.user.id) + '/'
        response = self.client.patch(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_different_user_forbidden(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user2.id) + '/'
        response = self.client.patch(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_self_allowed(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user.id) + '/'
        response = self.client.patch(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_user_forbidden(self):
        url = self.url + str(self.user.id) + '/'
        response = self.client.put(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_put_different_user_forbidden(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user2.id) + '/'
        response = self.client.put(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_put_self_allowed(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user.id) + '/'
        response = self.client.put(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_remove_user_forbidden(self):
        url = self.url + str(self.user.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_remove_different_user_forbidden(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user2.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_remove_self_allowed(self):
        self.client.force_login(user=self.user)
        url = self.url + str(self.user.id) + '/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
