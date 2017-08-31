from itertools import zip_longest

from dateutil.parser import parse
from dateutil import rrule
from dateutil.relativedelta import relativedelta
from dateutil.rrule import rrulestr
from django.utils.datetime_safe import datetime

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase
from foodsaving.groups.factories import GroupFactory
from foodsaving.groups.models import GroupMembership
from foodsaving.stores.factories import StoreFactory, PickupDateFactory, PickupDateSeriesFactory
from foodsaving.stores.models import PickupDate
from foodsaving.users.factories import UserFactory


def shift_date_in_local_time(old_date, delta, tz):
    # keeps local time equal, even through daylight saving time transitions
    # e.g. 20:00 + 1 day is always 20:00 on the next day, even if UTC offset changes
    old_date = old_date.astimezone(tz).replace(tzinfo=None)
    new_date = old_date + delta
    return tz.localize(new_date)


class TestPickupDateSeriesCreationAPI(APITestCase):
    """
    This is an integration test for the pickup-date-series API
    """
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.member = UserFactory()
        cls.group = GroupFactory(members=[cls.member, ])
        cls.store = StoreFactory(group=cls.group)

    def test_create_and_get_recurring_series(self):
        url = '/api/pickup-date-series/'
        recurrence = rrule.rrule(
            freq=rrule.WEEKLY,
            byweekday=[0, 1]  # Monday and Tuesday
        )
        start_date = self.group.timezone.localize(datetime.now().replace(hour=20, minute=0))
        pickup_series_data = {
            'max_collectors': 5,
            'store': self.store.id,
            'rule': str(recurrence),
            'start_date': start_date
        }
        start_date = start_date.replace(second=0, microsecond=0)
        self.client.force_login(user=self.member)
        response = self.client.post(url, pickup_series_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)
        series_id = response.data['id']
        self.assertEqual(parse(response.data['start_date']), start_date)
        del response.data['id']
        del response.data['start_date']
        expected_series_data = {
            'max_collectors': 5,
            'store': self.store.id,
            'rule': str(recurrence),
            'description': ''
        }
        self.assertEqual(response.data, expected_series_data)

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for _ in response.data:
            self.assertEqual(parse(_['start_date']), start_date)
            del _['id']
            del _['start_date']
        self.assertEqual(response.data, [expected_series_data])

        response = self.client.get(url + str(series_id) + '/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(parse(response.data['start_date']), start_date)
        del response.data['id']
        del response.data['start_date']
        self.assertEqual(response.data, expected_series_data)

        url = '/api/pickup-dates/'
        created_pickup_dates = []
        # do recurrence calculation in local time to avoid daylight saving time problems
        tz = self.group.timezone
        dates_list = recurrence.replace(
            dtstart=timezone.now().astimezone(tz).replace(hour=20, minute=0, second=0, microsecond=0, tzinfo=None)
        ).between(
            timezone.now().astimezone(tz).replace(tzinfo=None),
            timezone.now().astimezone(tz).replace(tzinfo=None) + relativedelta(weeks=4)
        )
        dates_list = [tz.localize(d) for d in dates_list]

        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # verify date field
        for response_data_item, expected_date in zip(response.data, dates_list):
            self.assertEqual(parse(response_data_item['date']), expected_date, response_data_item['date'])

        # verify non-date fields, don't need parsing
        for _ in response.data:
            del _['id']
            del _['date']
        for _ in dates_list:
            created_pickup_dates.append({
                'max_collectors': 5,
                'series': series_id,
                'collector_ids': [],
                'store': self.store.id,
                'description': ''
            })
        self.assertEqual(response.data, created_pickup_dates)


class TestPickupDateSeriesChangeAPI(APITestCase):
    """
    This is an integration test for the pickup-date-series API with pre-created series
    """
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.now = timezone.now()
        cls.member = UserFactory()
        cls.group = GroupFactory(members=[cls.member, ])
        cls.store = StoreFactory(group=cls.group)
        cls.series = PickupDateSeriesFactory(max_collectors=3, store=cls.store)
        cls.series.update_pickup_dates(start=lambda: cls.now)

    def test_change_max_collectors_for_series(self):
        "should change all future instances (except for individually changed ones), but not past ones"
        url = '/api/pickup-date-series/{}/'.format(self.series.id)
        self.client.force_login(user=self.member)
        response = self.client.patch(url, {'max_collectors': 99})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['max_collectors'], 99)

        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for _ in response.data:
            self.assertEqual(_['max_collectors'], 99)

    def test_change_start_time(self):
        self.client.force_login(user=self.member)
        # get original times
        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        original_dates = [parse(_['date']) for _ in response.data]

        # change times
        url = '/api/pickup-date-series/{}/'.format(self.series.id)
        new_startdate = shift_date_in_local_time(
            self.series.start_date,
            relativedelta(hours=2, minutes=20),
            self.group.timezone
        )
        response = self.client.patch(url, {'start_date': new_startdate.isoformat()})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(parse(response.data['start_date']), new_startdate)

        # compare resulting pickups
        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for response_pickup, old_date in zip(response.data, original_dates):
            self.assertEqual(
                parse(response_pickup['date']),
                shift_date_in_local_time(old_date, relativedelta(hours=2, minutes=20), self.group.timezone)
            )

    def test_change_start_date_to_future(self):
        self.client.force_login(user=self.member)
        # get original dates
        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        original_dates = [parse(_['date']) for _ in response.data]

        # change dates
        url = '/api/pickup-date-series/{}/'.format(self.series.id)
        new_startdate = shift_date_in_local_time(
            self.series.start_date,
            relativedelta(days=5),
            self.group.timezone
        )
        response = self.client.patch(url, {'start_date': new_startdate.isoformat()})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(parse(response.data['start_date']), new_startdate)

        # compare resulting pickups
        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        for response_pickup, old_date in zip_longest(response.data, original_dates):
            self.assertEqual(
                parse(response_pickup['date']),
                shift_date_in_local_time(old_date, relativedelta(days=5), self.group.timezone)
            )

    def test_change_start_date_to_past(self):
        self.client.force_login(user=self.member)
        # get original dates
        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        original_dates = [parse(_['date']) for _ in response.data]

        # change dates
        url = '/api/pickup-date-series/{}/'.format(self.series.id)
        new_startdate = shift_date_in_local_time(
            self.series.start_date,
            relativedelta(days=-5),
            self.group.timezone
        )
        response = self.client.patch(url, {'start_date': new_startdate.isoformat()})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(parse(response.data['start_date']), new_startdate)

        # compare resulting pickups
        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

        # shifting 5 days to the past is similar to shifting 2 days to the future
        for response_pickup, old_date in zip_longest(response.data, original_dates):
            new_date = shift_date_in_local_time(old_date, relativedelta(days=2), self.group.timezone)
            if new_date > self.now + relativedelta(weeks=self.store.weeks_in_advance):
                # date too far in future
                self.assertIsNone(response_pickup)
            else:
                self.assertEqual(parse(response_pickup['date']), new_date)

    def test_set_end_date(self):
        self.client.force_login(user=self.member)
        # change rule
        url = '/api/pickup-date-series/{}/'.format(self.series.id)
        rule = rrulestr(self.series.rule)\
            .replace(until=self.now + relativedelta(days=8))
        response = self.client.patch(url, {'rule': str(rule)})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['rule'], str(rule))

        # compare resulting pickups
        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data), 2, response.data)

    def test_set_end_date_with_users_have_joined_pickup(self):
        self.client.force_login(user=self.member)
        self.series.pickup_dates.last().collectors.add(self.member)
        # change rule
        url = '/api/pickup-date-series/{}/'.format(self.series.id)
        rule = rrulestr(self.series.rule)\
            .replace(until=self.now)
        response = self.client.patch(url, {'rule': str(rule)})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['rule'], str(rule))

        # compare resulting pickups
        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data), 1, response.data)

    def test_delete_pickup_series(self):
        "the series should get removed, as well as all upcoming pickups if they don't have collectors"
        self.client.force_login(user=self.member)
        joined_pickup = self.series.pickup_dates.last()
        joined_pickup.collectors.add(self.member)

        url = '/api/pickup-date-series/{}/'.format(self.series.id)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT, response.data)

        url = '/api/pickup-dates/'
        response = self.client.get(url, {'series': self.series.id, 'date_0': self.now})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data), 0, response.data)

        url = '/api/pickup-dates/{}/'.format(joined_pickup.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['collector_ids'], [self.member.id, ])

    def test_change_max_collectors_to_invalid_number_fails(self):
        self.client.force_login(user=self.member)
        url = '/api/pickup-date-series/{}/'.format(self.series.id)
        response = self.client.patch(url, {'max_collectors': -1})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)

    def test_set_invalid_store_fails(self):
        unrelated_store = StoreFactory()

        self.client.force_login(user=self.member)
        url = '/api/pickup-date-series/{}/'.format(self.series.id)
        response = self.client.patch(url, {'store': unrelated_store.id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data, {'store': ["You are not member of the store's group."]})

    def test_set_multiple_rules_fails(self):
        self.client.force_login(user=self.member)
        url = '/api/pickup-date-series/{}/'.format(self.series.id)
        response = self.client.patch(url, {
            'rule': 'RRULE:FREQ=WEEKLY;BYDAY=MO\nRRULE:FREQ=MONTHLY'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data, {'rule': ['Only single recurrence rules are allowed.']})

    def test_keep_changes_to_max_collectors(self):
        self.client.force_login(user=self.member)
        pickup_under_test = self.series.pickup_dates.first()
        url = '/api/pickup-dates/{}/'.format(pickup_under_test.id)

        # change setting of pickup
        response = self.client.patch(url, {'max_collectors': 666})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['max_collectors'], 666)

        # run regular update command of series
        self.series.update_pickup_dates()

        # check if changes persist
        url = '/api/pickup-dates/{}/'.format(pickup_under_test.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['max_collectors'], 666)

    def test_keep_changes_to_date(self):
        self.client.force_login(user=self.member)
        pickup_under_test = self.series.pickup_dates.first()
        url = '/api/pickup-dates/{}/'.format(pickup_under_test.id)

        # change setting of pickup
        target_date = timezone.now() + relativedelta(hours=2)
        response = self.client.patch(url, {'date': target_date})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(parse(response.data['date']), target_date)

        # run regular update command of series
        self.series.update_pickup_dates()

        # check if changes persist
        url = '/api/pickup-dates/{}/'.format(pickup_under_test.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(parse(response.data['date']), target_date)

    def test_keep_changes_to_description(self):
        self.client.force_login(user=self.member)
        pickup_under_test = self.series.pickup_dates.first()
        url = '/api/pickup-dates/{}/'.format(pickup_under_test.id)

        # change setting of pickup
        response = self.client.patch(url, {'description': 'asdf'})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['description'], 'asdf')

        # run regular update command of series
        self.series.update_pickup_dates()

        # check if changes persist
        url = '/api/pickup-dates/{}/'.format(pickup_under_test.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(response.data['description'], 'asdf')

    def test_dont_mark_as_changed_if_data_is_equal(self):
        self.client.force_login(user=self.member)
        pickup_under_test = self.series.pickup_dates.first()
        url = '/api/pickup-dates/{}/'.format(pickup_under_test.id)

        # change setting of pickup
        response = self.client.patch(url, {
            'date': pickup_under_test.date,
            'max_collectors': pickup_under_test.max_collectors
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

        pickup_under_test = PickupDate.objects.get(id=pickup_under_test.id)

        self.assertFalse(pickup_under_test.is_max_collectors_changed)
        self.assertFalse(pickup_under_test.is_date_changed)

    def test_keep_date_if_pickup_has_collectors(self):
        """
        https://github.com/yunity/foodsaving-frontend/issues/596
        It's unexpected if the date changes automatically when people have joined
        """
        self.client.force_login(user=self.member)
        pickup_under_test = self.series.pickup_dates.first()
        url = '/api/pickup-dates/{}/add/'.format(pickup_under_test.id)

        # join pickup
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        original_date = pickup_under_test.date

        # change series date
        url = '/api/pickup-date-series/{}/'.format(self.series.id)
        response = self.client.patch(url, {'start_date': self.series.start_date + relativedelta(hours=1)})
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

        # check if time of pickup is the same
        url = '/api/pickup-dates/{}/'.format(pickup_under_test.id)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(parse(response.data['date']), original_date, "time shouldn't change!")


class TestPickupDateSeriesAPIAuth(APITestCase):
    """ Testing actions that are forbidden """
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/pickup-date-series/'
        cls.series = PickupDateSeriesFactory()
        cls.series_url = '/api/pickup-date-series/{}/'.format(cls.series.id)
        cls.non_member = UserFactory()

    def test_create_as_anonymous_fails(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_create_as_nonmember_fails(self):
        self.client.force_login(self.non_member)
        response = self.client.post(self.url, {
            'store': self.series.store.id,
            'rule': 'FREQ=WEEKLY',
            'start_date': timezone.now()
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data, {'store': ["You are not member of the store's group."]})

    def test_list_as_anonymous_fails(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_list_as_nonmember_returns_empty_list(self):
        self.client.force_login(self.non_member)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data), 0)

    def test_get_as_anonymous_fails(self):
        response = self.client.get(self.series_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_get_as_nonmember_fails(self):
        self.client.force_login(self.non_member)
        response = self.client.get(self.series_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.data)

    def test_patch_as_anonymous_fails(self):
        response = self.client.patch(self.series_url, {})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_patch_as_nonmember_fails(self):
        self.client.force_login(self.non_member)
        response = self.client.patch(self.series_url, {})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.data)

    def test_delete_as_anonymous_fails(self):
        response = self.client.delete(self.series_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_delete_as_nonmember_fails(self):
        self.client.force_login(self.non_member)
        response = self.client.delete(self.series_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.data)


class TestPickupDatesAPI(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.url = '/api/pickup-dates/'

        # pickup date for group with one member and one store
        cls.member = UserFactory()
        cls.group = GroupFactory(members=[cls.member, ])
        cls.store = StoreFactory(group=cls.group)
        cls.pickup = PickupDateFactory(store=cls.store)
        cls.pickup_url = cls.url + str(cls.pickup.id) + '/'
        cls.join_url = cls.pickup_url + 'add/'
        cls.leave_url = cls.pickup_url + 'remove/'

        # not a member of the group
        cls.user = UserFactory()

        # another pickup date for above store
        cls.pickup_data = {'date': timezone.now() + relativedelta(days=2),
                           'max_collectors': 5,
                           'store': cls.store.id}

        # past pickup date
        cls.past_pickup_data = {'date': timezone.now() - relativedelta(days=1),
                                'max_collectors': 5,
                                'store': cls.store.id}
        cls.past_pickup = PickupDateFactory(store=cls.store, date=timezone.now() - relativedelta(days=1))
        cls.past_pickup_url = cls.url + str(cls.past_pickup.id) + '/'
        cls.past_join_url = cls.past_pickup_url + 'add/'
        cls.past_leave_url = cls.past_pickup_url + 'remove/'

    def test_create_pickup(self):
        response = self.client.post(self.url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_create_pickup_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)
        self.assertEqual(response.data, {'store': ['You are not member of the store\'s group.']})

    def test_create_pickup_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.post(self.url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, response.data)

    def test_create_past_pickup_date_fails(self):
        self.client.force_login(user=self.member)
        response = self.client.post(self.url, self.past_pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)

    def test_list_pickups(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_list_pickups_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data), 0)

    def test_list_pickups_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)
        self.assertEqual(len(response.data), 2)

    def test_retrieve_pickups(self):
        response = self.client.get(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_retrieve_pickups_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.get(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.data)

    def test_retrieve_pickups_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.get(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

    def test_patch_pickup(self):
        response = self.client.patch(self.pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_patch_pickup_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.patch(self.pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.data)

    def test_patch_pickup_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.patch(self.pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

    def test_patch_max_collectors_to_negative_value_fails(self):
        self.client.force_login(user=self.member)
        response = self.client.patch(self.pickup_url, {'max_collectors': -1})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, response.data)

    def test_patch_past_pickup_fails(self):
        self.client.force_login(user=self.member)
        response = self.client.patch(self.past_pickup_url, self.pickup_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_delete_pickup(self):
        response = self.client.delete(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_delete_pickup_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.delete(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.data)

    def test_delete_pickup_as_group_member(self):
        self.client.force_login(user=self.member)
        response = self.client.delete(self.pickup_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT, response.data)

    def test_delete_past_pickup_fails(self):
        self.client.force_login(user=self.member)
        response = self.client.delete(self.past_pickup_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_join_pickup(self):
        response = self.client.post(self.join_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_join_pickup_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.join_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.data)

    def test_join_pickup_as_member(self):
        self.client.force_login(user=self.member)
        response = self.client.post(self.join_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

    def test_join_pickup_without_max_collectors_as_member(self):
        self.client.force_login(user=self.member)
        p = PickupDateFactory(max_collectors=None, store=self.store)
        response = self.client.post('/api/pickup-dates/{}/add/'.format(p.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

    def test_join_full_pickup_fails(self):
        self.client.force_login(user=self.member)
        self.pickup.max_collectors = 1
        self.pickup.save()
        u2 = UserFactory()
        GroupMembership.objects.create(group=self.group, user=u2)
        self.pickup.collectors.add(u2)
        response = self.client.post(self.join_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)
        self.assertEqual(response.data, {'detail': 'Pickup date is already full.'})

    def test_join_past_pickup_fails(self):
        self.client.force_login(user=self.member)
        response = self.client.post(self.past_join_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_leave_pickup(self):
        response = self.client.post(self.leave_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)

    def test_leave_pickup_as_user(self):
        self.client.force_login(user=self.user)
        response = self.client.post(self.leave_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, response.data)

    def test_leave_pickup_as_member(self):
        self.client.force_login(user=self.member)
        self.pickup.collectors.add(self.member)
        response = self.client.post(self.leave_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, response.data)

    def test_leave_past_pickup_fails(self):
        self.client.force_login(user=self.member)
        self.past_pickup.collectors.add(self.member)
        response = self.client.post(self.past_leave_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, response.data)
