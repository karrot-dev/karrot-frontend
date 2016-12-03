from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from yunity.groups.factories import Group
from yunity.stores.factories import Store, PickupDate
from yunity.users.factories import User


class TestPickupdatesAPIFilter(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/pickup-dates/'

        # pickup date for group with one member and one store
        cls.member = User()
        cls.group = Group(members=[cls.member, ])
        cls.store = Store(group=cls.group)
        cls.pickup = PickupDate(store=cls.store)

        # and another store + group + pick-update
        cls.group2 = Group(members=[cls.member, ])
        cls.store2 = Store(group=cls.group2)
        cls.pickup2 = PickupDate(store=cls.store2)

    def test_filter_by_store(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.url, {'store': self.store.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.pickup.id)
        # UTC format is given differently after serializer
        self.assertEqual(response.data[0]['date'][:-1], self.pickup.date.isoformat()[:-6])

        response = self.client.get(self.url, {'store': self.store2.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.pickup2.id)

    def test_filter_by_group(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.url, {'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.pickup.id)

        response = self.client.get(self.url, {'group': self.group2.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.pickup2.id)

    def test_filter_after_date(self):
        one_day = timedelta(days=1)
        self.client.force_login(user=self.member)
        response = self.client.get(self.url, {'date_0': self.pickup.date + one_day})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        response = self.client.get(self.url, {'date_0': self.pickup.date - one_day})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_filter_before_date(self):
        one_day = timedelta(days=1)
        self.client.force_login(user=self.member)
        response = self.client.get(self.url, {'date_1': self.pickup.date + one_day})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        response = self.client.get(self.url, {'date_1': self.pickup.date - one_day})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
