from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase

from foodsaving.groups.factories import GroupFactory
from foodsaving.users.factories import UserFactory
from foodsaving.utils.tests.fake import faker


class TestUsersAPI(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.user2 = UserFactory()
        self.url = '/api/users/'
        self.user_data = {
            'email': faker.email(),
            'password': faker.name(),
            'display_name': faker.name(),
            'address': faker.address(),
            'latitude': faker.latitude(),
            'longitude': faker.longitude()
        }
        self.group = GroupFactory(members=[self.user, self.user2])
        self.another_common_group = GroupFactory(members=[self.user, self.user2])
        self.user_in_another_group = UserFactory()
        self.another_group = GroupFactory(members=[self.user_in_another_group, ])
        mail.outbox = []

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
        self.assertEqual(response.data['description'], self.user.description)

    def test_retrieve_user_in_another_group_fails(self):
        self.client.force_login(user=self.user2)
        url = self.url + str(self.user_in_another_group.id) + '/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
