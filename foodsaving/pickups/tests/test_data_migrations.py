import datetime
import pytz

from foodsaving.tests.utils import TestMigrations
from foodsaving.utils.tests.fake import faker


class TestExtractPickupsFromStoresApp(TestMigrations):
    migrate_from = [('groups', '0016_auto_20171101_0840'),
                    ('users', '0016_user_language'),
                    ('stores', '0027_auto_20171031_0942')]
    migrate_to = [('groups', '0016_auto_20171101_0840'),
                  ('users', '0016_user_language'),
                  ('stores', '0028_extract_pickups_app'),
                  ('pickups', '0001_initial')]

    def setUpBeforeMigration(self, apps):
        User = apps.get_model('users', 'User')
        Group = apps.get_model('groups', 'Group')
        Store = apps.get_model('stores', 'Store')
        PickupDateSeries = apps.get_model('stores', 'PickupDateSeries')
        PickupDate = apps.get_model('stores', 'PickupDate')
        Feedback = apps.get_model('stores', 'Feedback')

        self.email = faker.email()
        self.now = datetime.datetime.now(tz=pytz.utc)
        self.date = faker.date_time_between(start_date='now', end_date='+24h', tzinfo=pytz.utc)
        self.group_name = 'Group ' + faker.name()
        self.store_name = 'Store ' + faker.name()

        user = User.objects.create(email=self.email, display_name='Peter')
        group = Group.objects.create(name=self.group_name)
        store = Store.objects.create(name=self.store_name, group=group)
        pickup_date_series = PickupDateSeries.objects.create(store=store, start_date=self.now)
        pickup_date = PickupDate.objects.create(series=pickup_date_series, store=store, date=self.date)
        pickup_date.collectors.add(user)
        Feedback.objects.create(given_by=user, about=pickup_date)

    def test_extract_pickups_from_stores_app(self):
        User = self.apps.get_model('users', 'User')
        Group = self.apps.get_model('groups', 'Group')
        Store = self.apps.get_model('stores', 'Store')
        PickupDateSeries = self.apps.get_model('pickups', 'PickupDateSeries')
        PickupDate = self.apps.get_model('pickups', 'PickupDate')
        Feedback = self.apps.get_model('pickups', 'Feedback')

        user = User.objects.filter(email=self.email).first()
        group = Group.objects.filter(name=self.group_name).first()
        store = Store.objects.filter(name=self.store_name).first()
        pickup_date_series = PickupDateSeries.objects.filter(start_date=self.now).first()
        pickup_date = PickupDate.objects.filter(date=self.date).first()
        feedback = Feedback.objects.filter(given_by=user).first()

        self.assertEqual(store.group, group)
        self.assertEqual(pickup_date_series.store, store)
        self.assertEqual(pickup_date_series.start_date, self.now)
        self.assertTrue(pickup_date in pickup_date_series.pickup_dates.all())
        self.assertEqual(feedback.about, pickup_date)
