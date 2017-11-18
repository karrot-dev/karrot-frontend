from django.core.management import call_command
from rest_framework.test import APITestCase

from foodsaving.stores.factories import PickupDateSeriesFactory
from foodsaving.stores.models import PickupDate


class TestUpdatePickupDatesCommand(APITestCase):
    def setUp(self):
        self.series = PickupDateSeriesFactory()

    def test_run_command(self):
        # remember to also call this regularly on the server, e.g. via cron-job
        call_command('update_pickup_dates')
        self.assertGreater(PickupDate.objects.count(), 0)
