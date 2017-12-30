from datetime import timedelta

from dateutil.parser import parse
from dateutil.relativedelta import relativedelta
from rest_framework import status
from rest_framework.test import APITestCase

from django.utils import timezone

from config import settings
from foodsaving.groups.factories import GroupFactory
from foodsaving.pickups.factories import PickupDateFactory, PickupDateSeriesFactory, FeedbackFactory
from foodsaving.pickups.models import PickupDate as PickupDateModel
from foodsaving.tests.utils import ExtractPaginationMixin
from foodsaving.users.factories import UserFactory
from foodsaving.stores.factories import StoreFactory


class TestPickupdatesAPIFilter(APITestCase, ExtractPaginationMixin):
    def setUp(self):

        self.url = '/api/pickup-dates/'

        # pickup date for group with one member and one store
        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member, ])
        self.store = StoreFactory(group=self.group)
        self.pickup = PickupDateFactory(store=self.store)

        # and another store + group + pick-update
        self.group2 = GroupFactory(members=[self.member, ])
        self.store2 = StoreFactory(group=self.group2)
        self.pickup2 = PickupDateFactory(store=self.store2)

        # a pickup date series
        self.series = PickupDateSeriesFactory(store=self.store)
        self.series.update_pickup_dates()

        # another pickup date series
        self.series2 = PickupDateSeriesFactory(store=self.store)
        self.series2.update_pickup_dates()

    def test_filter_by_store(self):
        self.client.force_login(user=self.member)
        response = self.get_results(self.url, {'store': self.store.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for _ in response.data:
            self.assertEqual(_['store'], self.store.id)
        self.assertEqual(len(response.data), self.store.pickup_dates.count())

    def test_filter_by_group(self):
        self.client.force_login(user=self.member)
        response = self.get_results(self.url, {'group': self.group.id})
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
        response = self.get_results(self.url, {'series': self.series.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for _ in response.data:
            self.assertEqual(_['series'], self.series.id)
        self.assertEqual(len(response.data), self.series.pickup_dates.count())

    def test_filter_after_date(self):
        self.client.force_login(user=self.member)
        query_date = self.pickup.date + timedelta(days=1)
        response = self.get_results(self.url, {'date_0': query_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for _ in response.data:
            self.assertGreater(parse(_['date']), query_date)
        selected_pickups = PickupDateModel.objects.filter(store__group__members=self.member) \
            .filter(date__gte=query_date)
        self.assertEqual(len(response.data), selected_pickups.count())

    def test_filter_before_date(self):
        self.client.force_login(user=self.member)
        query_date = self.pickup.date + timedelta(days=10)
        response = self.get_results(self.url, {'date_1': query_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for _ in response.data:
            self.assertLess(parse(_['date']), query_date)
        selected_pickups = PickupDateModel.objects.filter(store__group__members=self.member) \
            .filter(date__lte=query_date)
        self.assertEqual(len(response.data), selected_pickups.count())


class TestFeedbackPossibleFilter(APITestCase, ExtractPaginationMixin):
    def setUp(self):
        self.url = '/api/pickup-dates/'
        self.oneWeekAgo = timezone.now() - relativedelta(weeks=1)
        self.tooLongAgo = timezone.now() - relativedelta(days=settings.FEEDBACK_POSSIBLE_DAYS + 1)

        self.member = UserFactory()
        self.group = GroupFactory(members=[self.member, ])
        self.store = StoreFactory(group=self.group)

        self.pickupFeedbackPossible = PickupDateFactory(
            store=self.store,
            collectors=[self.member, ],
            date=self.oneWeekAgo
        )
        self.pickupUpcoming = PickupDateFactory(store=self.store, collectors=[self.member, ])
        self.pickupNotCollector = PickupDateFactory(store=self.store, date=self.oneWeekAgo)
        self.pickupTooLongAgo = PickupDateFactory(store=self.store, date=self.tooLongAgo)

        self.pickupFeedbackAlreadyGiven = PickupDateFactory(
            store=self.store, collectors=[self.member, ], date=self.oneWeekAgo
        )
        self.feedback = FeedbackFactory(about=self.pickupFeedbackAlreadyGiven, given_by=self.member)

    def test_filter_feedback_possible(self):
        self.client.force_login(user=self.member)
        response = self.get_results(self.url, {'feedback_possible': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.pickupFeedbackPossible.id)
