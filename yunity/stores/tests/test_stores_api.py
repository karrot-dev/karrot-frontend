from rest_framework import status
from rest_framework.test import APITestCase
from yunity.groups.factories import Group
from yunity.stores.factories import Store
from yunity.users.factories import User
from yunity.utils.tests.fake import faker


class TestStoresAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/stores/'

        # group with two members and one store
        cls.member = User()
        cls.member2 = User()
        cls.group = Group(members=[cls.member, cls.member2])
        cls.store = Store(group=cls.group)
        cls.store_url = cls.url + str(cls.store.id) + '/'

        # not a member
        cls.user = User()

        # another store for above group
        cls.store_data = {'name': faker.name(),
                          'description': faker.name(),
                          'group': cls.group.id,
                          'address': faker.address(),
                          'latitude': faker.latitude(),
                          'longitude': faker.longitude()}

        # another group
        cls.different_group = Group(members=[cls.member2, ])

    def test_create_store(self):
        response = self.client.post(self.url, self.store_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_store_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url, self.store_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_store_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.post(self.url, self.store_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], self.store_data['name'])

    def test_list_stores(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_stores_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_list_stores_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_stores(self):
        response = self.client.get(self.store_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_stores_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.store_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_stores_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.store_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_store(self):
        response = self.client.patch(self.store_url, self.store_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_store_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.patch(self.store_url, self.store_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_store_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.patch(self.store_url, self.store_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_store(self):
        response = self.client.put(self.store_url, self.store_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_put_store_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.put(self.store_url, self.store_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_put_store_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.put(self.store_url, self.store_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_change_group_as_member_in_one(self):
        self.client.force_login(user=self.member)
        response = self.client.patch(self.store_url, {'group': self.different_group.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_change_group_as_member_in_both(self):
        self.client.force_login(user=self.member2)
        response = self.client.patch(self.store_url, {'group': self.different_group.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.patch(self.store_url, {'group': self.group.id}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_stores(self):
        response = self.client.delete(self.store_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_stores_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.delete(self.store_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_stores_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.delete(self.store_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
