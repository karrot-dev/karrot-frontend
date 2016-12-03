from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from yunity.groups.factories import Group
from yunity.stores.factories import Store, PickupDate
from yunity.users.factories import User


class TestPickupDatesAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/pickup-dates/'

        # pickup date for group with one member and one store
        cls.member = User()
        cls.group = Group(members=[cls.member, ])
        cls.store = Store(group=cls.group)
        cls.pickup = PickupDate(store=cls.store)
        cls.pickup_url = cls.url + str(cls.pickup.id) + '/'
        cls.join_url = cls.pickup_url + 'add/'
        cls.leave_url = cls.pickup_url + 'remove/'

        # not a member of the group
        cls.user = User()

        # another pickup date for above store
        cls.pickup_data = {'date': timezone.now(),
                           'max_collectors': 5,
                           'store': cls.store.id}

        # past pickup date
        cls.past_pickup_data = {'date': timezone.now() - timedelta(days=1),
                                'max_collectors': 5,
                                'store': cls.store.id}
        cls.past_pickup = PickupDate(store=cls.store, date=timezone.now() - timedelta(days=1))
        cls.past_pickup_url = cls.url + str(cls.past_pickup.id) + '/'
        cls.past_join_url = cls.past_pickup_url + 'add/'
        cls.past_leave_url = cls.past_pickup_url + 'remove/'

    def test_create_pickup(self):
        response = self.client.post(self.url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_pickup_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_pickup_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.post(self.url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_past_pickup_date_fails(self):
        self.client.force_login(user=self.member)
        response = self.client.post(self.url, self.past_pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_pickups(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_list_pickups_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_list_pickups_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_retrieve_pickups(self):
        response = self.client.get(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_retrieve_pickups_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_pickups_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_pickup(self):
        response = self.client.patch(self.pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_pickup_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.patch(self.pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_pickup_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.patch(self.pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_patch_past_pickup_fails(self):
        self.client.force_login(user=self.member)
        response = self.client.patch(self.past_pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_put_pickup(self):
        response = self.client.put(self.pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_put_pickup_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.put(self.pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_put_pickup_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.put(self.pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_put_past_pickup_fails(self):
        self.client.force_login(user=self.member)
        response = self.client.put(self.past_pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_pickup(self):
        response = self.client.delete(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_pickup_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.delete(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_pickup_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.delete(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_past_pickup_fails(self):
        self.client.force_login(user=self.member)
        response = self.client.delete(self.past_pickup_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_join_pickup(self):
        response = self.client.post(self.join_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_join_pickup_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.join_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_join_pickup_as_member(self):
        self.client.force_login(user=self.member)
        response = self.client.post(self.join_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_join_past_pickup_fails(self):
        self.client.force_login(user=self.member)
        response = self.client.post(self.past_join_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_leave_pickup(self):
        response = self.client.post(self.leave_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_leave_pickup_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.leave_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_leave_pickup_as_member(self):
        self.client.force_login(user=self.member)
        self.pickup.collectors.add(self.member)
        response = self.client.post(self.leave_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leave_past_pickup_fails(self):
        self.client.force_login(user=self.member)
        self.past_pickup.collectors.add(self.member)
        response = self.client.post(self.past_leave_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
