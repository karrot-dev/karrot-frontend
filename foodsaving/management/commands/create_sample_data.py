import random

import pytz
from dateutil.relativedelta import relativedelta
from django.core import mail
from django.core.management import call_command
from django.http import request
from django.utils import timezone

from django.core.management.base import BaseCommand
from rest_framework.test import APIClient

from foodsaving.groups.models import Group
from foodsaving.stores.models import Store, PickupDate, PickupDateSeries
from foodsaving.users.models import User
from foodsaving.utils.tests.fake import faker


class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument('--more', action='store_true', dest='more_data')
        parser.add_argument('--quick', action='store_true', dest='less_data')

    def handle(self, *args, **options):
        def print(*args):
            self.stdout.write(' '.join([str(_) for _ in args]))

        def print_success(*args):
            self.stdout.write(self.style.SUCCESS(' '.join(str(_) for _ in args)))

        ######################
        # Setup
        # override the allowed hosts, similar to tests
        # needs teardown at the end
        ######################

        from django.conf import settings

        def setup_environment():
            mail._BLA_original_email_backend = settings.EMAIL_BACKEND
            settings.EMAIL_BACKEND = 'django.core.mail.backends.locmem.EmailBackend'
            request._BLA_original_allowed_hosts = settings.ALLOWED_HOSTS
            settings.ALLOWED_HOSTS = ['*']

        def teardown_environment():
            settings.EMAIL_BACKEND = mail._BLA_original_email_backend
            settings.ALLOWED_HOSTS = request._BLA_original_allowed_hosts

        setup_environment()

        ######################
        # Helper functions
        ######################

        c = APIClient()
        groups = []
        users = []

        def login_user(id=None):
            # if no user is provided, choose a random user from the list
            if not id:
                id = random.choice(users)['id']
            u = User.objects.get(id=id)
            c.force_login(u)
            print('login as', u)
            return u

        password = '123'

        def make_user():
            data = c.post('/api/users/', {
                'email': str(timezone.now().microsecond) + faker.email(),
                'password': password,
                'display_name': faker.name(),
                'description': 'I am a fake user'
            }).data
            print('created user:', data['email'])
            return data

        def make_group():
            data = c.post('/api/groups/', {
                'name': 'Group ' + faker.city(),
                'description': faker.text(),
                'timezone': 'Europe/Berlin',
                'address': faker.street_address(),
                'latitude': faker.latitude(),
                'longitude': faker.longitude()
            }).data
            print('created group: ', data['id'], data['name'])
            return data

        def modify_group(group):
            data = c.patch('/api/groups/{}/'.format(group), {
                'name': 'Group (edited) ' + faker.city(),
                'description': faker.text(),
            }).data
            print('modified group: ', group)
            return data

        def join_group(group):
            print('joined group {}'.format(group))
            return c.post('/api/groups/{}/join/'.format(group)).data

        def leave_group(group):
            print('left group {}'.format(group))
            return c.post('/api/groups/{}/leave/'.format(group)).data

        def make_store(group):
            data = c.post('/api/stores/', {
                'name': 'Store ' + faker.name(),
                'description': faker.text(),
                'group': group,
                'address': faker.street_address(),
                'latitude': faker.latitude(),
                'longitude': faker.longitude()
            }).data
            print('created store: ', data['id'], data['name'])
            return data

        def modify_store(store):
            data = c.patch('/api/stores/{}/'.format(store), {
                'name': 'Store (edited) ' + faker.name(),
                'description': faker.text(),
            }).data
            print('modified store: ', store)
            return data

        def delete_store(store):
            data = c.delete('/api/stores/{}/'.format(store)).data
            print('deleted store: ', store)
            return data

        def make_series(store):
            data = c.post('/api/pickup-date-series/', {
                'start_date': faker.date_time_between(start_date='now', end_date='+24h', tzinfo=pytz.utc),
                'rule': 'FREQ=WEEKLY',
                'max_collectors': 10,
                'store': store
            }).data
            print('created series: ', data)
            return data

        def modify_series(series):
            data = c.patch('/api/pickup-date-series/{}/'.format(series), {
                'start_date': timezone.now().replace(hour=20),
                'rule': 'FREQ=WEEKLY'
            }).data
            print('modified series: ', series)
            return data

        def delete_series(series):
            data = c.delete('/api/pickup-date-series/{}/'.format(series)).data
            print('deleted series: ', series)
            return data

        def make_pickup(store):
            data = c.post('/api/pickup-dates/', {
                'date': faker.date_time_between(start_date='+2d', end_date='+7d', tzinfo=pytz.utc),
                'store': store,
                'max_collectors': 10
            }).data
            print('created pickup: ', data)
            return data

        def modify_pickup(pickup):
            data = c.post('/api/pickup-dates/{}/'.format(pickup), {
                'max_collectors': 3
            }).data
            print('modified pickup: ', pickup)
            return data

        def delete_pickup(pickup):
            data = c.delete('/api/pickup-dates/{}/'.format(pickup)).data
            print('deleted pickup: ', pickup)
            return data

        def join_pickup(pickup):
            data = c.post('/api/pickup-dates/{}/add/'.format(pickup)).data
            print('joined pickup: ', pickup)
            return data

        def leave_pickup(pickup):
            data = c.post('/api/pickup-dates/{}/remove/'.format(pickup)).data
            print('left pickup: ', pickup)
            return data

        ######################
        # Sample data
        ######################

        i = 0 if options['more_data'] else 2 if options['less_data'] else 1

        # these are our ambassadors / group creators
        n_groups = (10, 5, 1)[i]
        for _ in range(n_groups):
            user = make_user()
            users.append(user)
            login_user(user['id'])
            group = make_group()
            groups.append(group)
            for _ in range(5):
                store = make_store(group['id'])
                make_series(store['id'])
                pickup = make_pickup(store['id'])
                join_pickup(pickup['id'])

        # group members
        min_members = (10, 4, 1)[i]
        max_members = (30, 8, 2)[i]
        n_pickups = (4, 3, 2)[i]
        for g in groups:
            for _ in range(random.randint(min_members, max_members)):
                user = make_user()
                users.append(user)
                login_user(user['id'])
                join_group(g['id'])
                for p in PickupDate.objects.filter(store__group_id=g['id']).order_by('?')[:n_pickups]:
                    join_pickup(p.id)

        # modify
        u = login_user()
        o = Group.objects.filter(members=u).first()
        modify_group(o.id)

        u = login_user()
        o = Store.objects.filter(group__members=u).first()
        modify_store(o.id)

        u = login_user()
        o = PickupDateSeries.objects.filter(store__group__members=u).first()
        modify_series(o.id)

        u = login_user()
        o = PickupDate.objects.filter(store__group__members=u).first()
        modify_pickup(o.id)

        # leave
        u = login_user()
        o = PickupDate.objects.filter(collectors=u).first()
        leave_pickup(o.id)

        # pickup done
        # This is a hack. We shift the first pickup of a user back by four weeks and call the collector function
        n_done = (5, 3, 1)[i]
        for _ in range(n_done):
            # login not necessary, but gives us a user object
            u = login_user()
            p = PickupDate.objects.filter(store__group__members=u).first()
            join_pickup(p.id)
            p.date = p.date - relativedelta(weeks=4)
            p.save()
            print('picked up some food at', p.date)
        call_command('process_finished_pickup_dates')

        # delete
        u = login_user()
        o = PickupDate.objects.filter(store__group__members=u).first()
        delete_pickup(o.id)

        u = login_user()
        o = PickupDateSeries.objects.filter(store__group__members=u).first()
        delete_series(o.id)

        u = login_user()
        o = Store.objects.filter(group__members=u).first()
        delete_store(o.id)

        u = login_user()
        o = Group.objects.filter(members=u).first()
        leave_group(o.id)

        print_success('Done! You can login with any of those mail addresses and password {}'.format(password))
        print_success('Consider using the --more argument next time for more users.')

        teardown_environment()
