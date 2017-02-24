from dateutil.relativedelta import relativedelta
from django.core.management import call_command
from django.utils import timezone
from rest_framework.test import APITestCase

from foodsaving.users.factories import UserFactory
from foodsaving.groups.factories import Group as GroupFactory
from foodsaving.stores.factories import Store as StoreFactory, PickupDate as PickupDateFactory, \
    PickupDateSeries as PickupDateSeriesFactory

history_url = '/api/history/'


class TestHistoryAPICreateGroup(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.member = UserFactory()

    def test_create_group(self):
        self.client.force_login(self.member)
        self.client.post('/api/groups/', {'name': 'xyzabc', 'timezone': 'Europe/Berlin'})
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'GROUP_CREATE')


class TestHistoryAPIWithExistingGroup(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.member = UserFactory()
        cls.group = GroupFactory(members=[cls.member, ])
        cls.group_url = '/api/groups/{}/'.format(cls.group.id)

    def test_modify_group(self):
        self.client.force_login(self.member)
        self.client.patch(self.group_url, {'name': 'something new'})
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'GROUP_MODIFY')
        self.assertEqual(response.data[0]['payload']['name'], 'something new')

    def test_dont_modify_group(self):
        self.client.force_login(self.member)
        self.client.patch(self.group_url, {'name': self.group.name})
        response = self.client.get(history_url)
        self.assertEqual(len(response.data), 0)

    def test_join_group(self):
        user = UserFactory()
        self.client.force_login(user)
        self.client.post(self.group_url + 'join/')
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'GROUP_JOIN')

    def test_leave_group(self):
        user = UserFactory()
        self.group.members.add(user)
        self.client.force_login(user)
        self.client.post(self.group_url + 'leave/')

        self.client.force_login(self.member)
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'GROUP_LEAVE')

    def test_create_store(self):
        self.client.force_login(self.member)
        self.client.post('/api/stores/', {'name': 'xyzabc', 'group': self.group.id})
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'STORE_CREATE')


class TestHistoryAPIWithExistingStore(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.member = UserFactory()
        cls.group = GroupFactory(members=[cls.member, ])
        cls.store = StoreFactory(group=cls.group)
        cls.store_url = '/api/stores/{}/'.format(cls.store.id)

    def test_modify_store(self):
        self.client.force_login(self.member)
        self.client.patch(self.store_url, {'name': 'newnew'})
        response = self.client.get(history_url)
        self.assertEqual(len(response.data), 1, response.data)
        self.assertEqual(response.data[0]['typus'], 'STORE_MODIFY')
        self.assertEqual(response.data[0]['payload']['name'], 'newnew')

    def test_dont_modify_store(self):
        self.client.force_login(self.member)
        self.client.patch(self.store_url, {'name': self.store.name})
        response = self.client.get(history_url)
        self.assertEqual(len(response.data), 0)

    def test_delete_store(self):
        self.client.force_login(self.member)
        self.client.delete(self.store_url, {'name': 'new'})
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'STORE_DELETE')

    def test_create_pickup(self):
        self.client.force_login(self.member)
        self.client.post('/api/pickup-dates/', {
            'date': timezone.now() + relativedelta(days=1),
            'store': self.store.id
        })
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'PICKUP_CREATE')

    def test_create_series(self):
        self.client.force_login(self.member)
        self.client.post('/api/pickup-date-series/', {
            'start_date': timezone.now(),
            'rule': 'FREQ=WEEKLY',
            'store': self.store.id
        })
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'SERIES_CREATE')


class TestHistoryAPIWithExistingPickups(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.member = UserFactory()
        cls.group = GroupFactory(members=[cls.member, ])
        cls.store = StoreFactory(group=cls.group)
        cls.pickup = PickupDateFactory(store=cls.store)
        cls.pickup_url = '/api/pickup-dates/{}/'.format(cls.pickup.id)
        cls.series = PickupDateSeriesFactory(store=cls.store)
        cls.series_url = '/api/pickup-date-series/{}/'.format(cls.series.id)

    def test_modify_pickup(self):
        self.client.force_login(self.member)
        self.client.patch(self.pickup_url, {'max_collectors': '11'})
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'PICKUP_MODIFY')
        self.assertEqual(response.data[0]['payload']['max_collectors'], '11')

    def test_dont_modify_pickup(self):
        self.client.force_login(self.member)
        self.client.patch(self.pickup_url, {'date': self.pickup.date})
        response = self.client.get(history_url)
        self.assertEqual(len(response.data), 0)

    def test_delete_pickup(self):
        self.client.force_login(self.member)
        self.client.delete(self.pickup_url)
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'PICKUP_DELETE')

    def test_modify_series(self):
        self.client.force_login(self.member)
        self.client.patch(self.series_url, {'max_collectors': '11'})
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'SERIES_MODIFY')
        self.assertEqual(response.data[0]['payload']['max_collectors'], '11')

    def test_dont_modify_series(self):
        self.client.force_login(self.member)
        self.client.patch(self.series_url, {'rule': self.series.rule})
        response = self.client.get(history_url)
        self.assertEqual(len(response.data), 0)

    def test_delete_series(self):
        self.client.force_login(self.member)
        self.client.delete(self.series_url)
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'SERIES_DELETE')

    def test_join_pickup(self):
        self.client.force_login(self.member)
        self.client.post(self.pickup_url + 'add/')
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'PICKUP_JOIN')

    def test_leave_pickup(self):
        self.client.force_login(self.member)
        self.pickup.collectors.add(self.member)
        self.client.post(self.pickup_url + 'remove/')
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'PICKUP_LEAVE')


class TestHistoryAPIWithDonePickup(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.member = UserFactory()
        cls.group = GroupFactory(members=[cls.member, ])
        cls.store = StoreFactory(group=cls.group)
        cls.pickup = PickupDateFactory(
            store=cls.store,
            date=timezone.now() - relativedelta(days=1)
        )
        cls.pickup_url = '/api/pickup-dates/{}/'.format(cls.pickup.id)
        cls.pickup.collectors.add(cls.member)
        call_command('delete_old_pickup_dates')

    def test_pickup_done(self):
        self.client.force_login(self.member)
        response = self.client.get(history_url)
        self.assertEqual(response.data[0]['typus'], 'PICKUP_DONE')

    def test_filter_pickup_done(self):
        self.client.force_login(self.member)
        response = self.client.get(history_url, {'typus': 'PICKUP_DONE'})
        self.assertEqual(response.data[0]['typus'], 'PICKUP_DONE')
        response = self.client.get(history_url, {'typus': 'GROUP_JOIN'})
        self.assertEqual(len(response.data), 0)
