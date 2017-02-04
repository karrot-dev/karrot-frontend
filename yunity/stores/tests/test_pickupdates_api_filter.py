from datetime import timedelta

from dateutil.parser import parse
from rest_framework import status
from rest_framework.test import APITestCase
from yunity.groups.factories import Group
from yunity.stores.factories import Store, PickupDate, PickupDateSeries
from yunity.stores.models import PickupDate as PickupDateModel
from yunity.users.factories import UserFactory


class TestPickupdatesAPIFilter(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/pickup-dates/'

        # pickup date for group with one member and one store
        cls.member = UserFactory()
        cls.group = Group(members=[cls.member, ])
        cls.store = Store(group=cls.group)
        cls.pickup = PickupDate(store=cls.store)

        # and another store + group + pick-update
        cls.group2 = Group(members=[cls.member, ])
        cls.store2 = Store(group=cls.group2)
        cls.pickup2 = PickupDate(store=cls.store2)

        # a pickup date series
        cls.series = PickupDateSeries(store=cls.store)
        cls.series.create_pickup_dates()

        # another pickup date series
        cls.series2 = PickupDateSeries(store=cls.store)
        cls.series2.create_pickup_dates()

    def test_filter_by_store(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.url, {'store': self.store.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for _ in response.data:
            self.assertEqual(_['store'], self.store.id)
        self.assertEqual(len(response.data), self.store.pickup_dates.count())

    def test_filter_by_group(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.url, {'group': self.group.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        store_ids = [_.id for _ in self.group.store.all()]
        for _ in response.data:
            self.assertTrue(_['store'] in store_ids)
        self.assertEqual(
            len(response.data),
            sum([store.pickup_dates.count() for store in self.group.store.all()])
        )

    def test_filter_by_series(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.url, {'series': self.series.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for _ in response.data:
            self.assertEqual(_['series'], self.series.id)
        self.assertEqual(len(response.data), self.series.pickup_dates.count())

    def test_filter_after_date(self):
        self.client.force_login(user=self.member)
        query_date = self.pickup.date + timedelta(days=1)
        response = self.client.get(self.url, {'date_0': query_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for _ in response.data:
            self.assertGreater(parse(_['date']), query_date)
        selected_pickups = PickupDateModel.objects.filter(store__group__members=self.member)\
            .filter(date__gte=query_date)
        self.assertEqual(len(response.data), selected_pickups.count())

    def test_filter_before_date(self):
        self.client.force_login(user=self.member)
        query_date = self.pickup.date + timedelta(days=10)
        response = self.client.get(self.url, {'date_1': query_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for _ in response.data:
            self.assertLess(parse(_['date']), query_date)
        selected_pickups = PickupDateModel.objects.filter(store__group__members=self.member)\
            .filter(date__lte=query_date)
        self.assertEqual(len(response.data), selected_pickups.count())
