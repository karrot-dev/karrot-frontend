from copy import deepcopy
from rest_framework import status
from rest_framework.test import APITestCase
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from dateutil.parser import parse

from foodsaving.groups.factories import GroupFactory
from foodsaving.stores.factories import StoreFactory
from foodsaving.users.factories import UserFactory
from foodsaving.utils.tests.fake import faker
from foodsaving.pickups.factories import PickupDateSeriesFactory, PickupDateFactory


class TestStoresAPI(APITestCase):
    def setUp(self):
        self.url = '/api/stores/'

        # group with two members and one store
        self.member = UserFactory()
        self.member2 = UserFactory()
        self.group = GroupFactory(members=[self.member, self.member2])
        self.store = StoreFactory(group=self.group)
        self.store_url = self.url + str(self.store.id) + '/'

        # not a member
        self.user = UserFactory()

        # another store for above group
        self.store_data = {'name': faker.name(),
                           'description': faker.name(),
                           'group': self.group.id,
                           'address': faker.address(),
                           'latitude': faker.latitude(),
                           'longitude': faker.longitude()}

        # another group
        self.different_group = GroupFactory(members=[self.member2, ])

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

    def test_create_store_with_short_name_fails(self):
        self.client.force_login(user=self.member)
        data = deepcopy(self.store_data)
        data['name'] = 's'
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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

    def test_valid_status(self):
        self.client.force_login(user=self.member)
        response = self.client.patch(self.store_url, {'status': 'active'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_status(self):
        self.client.force_login(user=self.member)
        response = self.client.patch(self.store_url, {'status': 'foobar'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

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
        PickupDateSeriesFactory(store=self.store)
        PickupDateFactory(store=self.store)

        self.client.force_login(user=self.member)
        response = self.client.delete(self.store_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        response = self.client.get(self.url)
        self.assertEqual(len(response.data), 0)

        # should also delete pickup dates & series
        response = self.client.get('/api/pickup-dates/')
        self.assertEqual(len(response.data), 0)
        response = self.client.get('/api/pickup-date-series/')
        self.assertEqual(len(response.data), 0)


class TestStoreChangesPickupDateSeriesAPI(APITestCase):
    def setUp(self):

        self.now = timezone.now()
        self.url = '/api/stores/'
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member, ])
        self.store = StoreFactory(group=self.group)
        self.store_url = self.url + str(self.store.id) + '/'
        self.series = PickupDateSeriesFactory(max_collectors=3, store=self.store)
        self.series.update_pickup_dates(start=lambda: self.now)

    def test_reduce_weeks_in_advance(self):
        self.client.force_login(user=self.member)

        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

        response = self.client.patch(self.store_url, {'weeks_in_advance': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['weeks_in_advance'], 2)

        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for _ in response.data:
            self.assertLessEqual(parse(_['date']), self.now + relativedelta(weeks=2, hours=1))

    def test_increase_weeks_in_advance(self):
        self.client.force_login(user=self.member)

        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        original_dates = [parse(_['date']) for _ in response.data]

        response = self.client.patch(self.store_url, {'weeks_in_advance': 10})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['weeks_in_advance'], 10)

        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertGreater(len(response.data), len(original_dates))
        for return_date in response.data:
            self.assertLessEqual(parse(return_date['date']), self.now + relativedelta(weeks=10))

    def test_set_weeks_to_invalid_value(self):
        self.client.force_login(user=self.member)
        response = self.client.patch(self.store_url, {'weeks_in_advance': 0})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
