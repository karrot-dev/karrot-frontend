from dateutil import rrule
from dateutil.relativedelta import relativedelta
from django.db import DataError
from django.db import IntegrityError
from django.test import TestCase
from django.utils import timezone
from datetime import datetime

from foodsaving.groups.factories import GroupFactory
from foodsaving.stores.factories import StoreFactory, PickupDateFactory
from foodsaving.stores.models import Store, PickupDateSeries, PickupDate, Feedback
from foodsaving.users.factories import UserFactory


class TestStoreModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.group = GroupFactory()

    def test_create_fails_if_name_too_long(self):
        with self.assertRaises(DataError):
            Store.objects.create(name='a' * 81, group=self.group)

    def test_create_store_with_same_name_fails(self):
        Store.objects.create(name='abcdef', group=self.group)
        with self.assertRaises(IntegrityError):
            Store.objects.create(name='abcdef', group=self.group)

    def test_create_store_with_same_name_in_different_groups_works(self):
        Store.objects.create(name='abcdef', group=self.group)
        Store.objects.create(name='abcdef', group=GroupFactory())


class TestFeedbackModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.pickup = PickupDateFactory()
        cls.user = UserFactory()

    def test_weight_is_negative_fails(self):
        with self.assertRaises(IntegrityError):
            Feedback.objects.create(weight=-1, about=self.pickup, given_by=self.user, comment="soup")

    def test_weight_is_null_passes(self):
        Feedback.objects.create(about=self.pickup, given_by=self.user, comment="soup")

    def test_comment_is_null_passes(self):
        Feedback.objects.create(about=self.pickup, given_by=self.user, weight=1)

    def test_create_fails_if_comment_too_long(self):
        with self.assertRaises(DataError):
            Feedback.objects.create(comment='a' * 100001, about=self.pickup, given_by=self.user, weight=1)


class TestPickupDateSeriesModel(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.store = StoreFactory()
        cls.recurrence = rrule.rrule(
            freq=rrule.WEEKLY,
        )

    def test_daylight_saving_time_to_summer(self):
        start_date = self.store.group.timezone.localize(datetime.now().replace(2017, 3, 18, 15, 0, 0, 0))

        series = PickupDateSeries(
            store=self.store,
            rule=str(self.recurrence),
            start_date=start_date
        )
        series.save()
        series.update_pickup_dates(start=lambda: timezone.now().replace(2017, 3, 18, 4, 40, 13))
        expected_dates = []
        for month, day in [
            (3, 18), (3, 25), (4, 1), (4, 8)
        ]:
            expected_dates.append(
                self.store.group.timezone.localize(datetime(2017, month, day, 15, 0))
            )
        for actual_date, expected_date in zip(PickupDate.objects.filter(series=series), expected_dates):
            self.assertEqual(actual_date.date, expected_date)

    def test_daylight_saving_time_to_winter(self):
        start_date = self.store.group.timezone.localize(datetime.now().replace(2016, 10, 22, 15, 0, 0, 0))

        series = PickupDateSeries(
            store=self.store,
            rule=str(self.recurrence),
            start_date=start_date
        )
        series.save()
        series.update_pickup_dates(start=lambda: timezone.now().replace(2016, 10, 22, 4, 40, 13))
        expected_dates = []
        for month, day in [
            (10, 22), (10, 29), (11, 5), (11, 12)
        ]:
            expected_dates.append(
                self.store.group.timezone.localize(datetime(2016, month, day, 15, 0))
            )
        for actual_date, expected_date in zip(PickupDate.objects.filter(series=series), expected_dates):
            self.assertEqual(actual_date.date, expected_date)

    def test_delete(self):
        now = timezone.now()
        two_weeks_ago = now - relativedelta(weeks=2)
        series = PickupDateSeries(
            store=self.store,
            rule=str(self.recurrence),
            start_date=two_weeks_ago
        )
        series.save()
        series.update_pickup_dates(start=lambda: two_weeks_ago)
        pickup_dates = series.pickup_dates.all()
        past_date_count = pickup_dates.filter(date__lt=now).count()
        self.assertGreater(pickup_dates.count(), 2)
        series.delete()
        self.assertEqual(PickupDate.objects.filter(date__gte=now).count(), 0)
        self.assertEqual(PickupDate.objects.filter(date__lt=now).count(), past_date_count)
