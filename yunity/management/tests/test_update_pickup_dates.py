from django.core.management import call_command
from rest_framework.test import APITestCase

from yunity.stores.factories import PickupDateSeries as PickupDateSeriesFactory
from yunity.stores.models import PickupDate


class TestUpdatePickupDatesCommand(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.series = PickupDateSeriesFactory()

    def test_run_command(self):
        # remember to also call this regularly on the server, e.g. via cron-job
        call_command('update_pickup_dates')
        self.assertGreater(PickupDate.objects.count(), 0)
