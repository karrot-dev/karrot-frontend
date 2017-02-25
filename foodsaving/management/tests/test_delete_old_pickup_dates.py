from dateutil.relativedelta import relativedelta
from django.core.management import call_command
from django.utils import timezone
from rest_framework.test import APITestCase

from foodsaving.history.models import History
from foodsaving.stores.factories import PickupDateFactory
from foodsaving.stores.models import PickupDate


class TestDeleteOldPickupDatesCommand(APITestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.series = PickupDateFactory(date=timezone.now() - relativedelta(weeks=1))

    def test_run_command(self):
        # remember to also call this regularly on the server, e.g. via cron-job
        call_command('delete_old_pickup_dates')
        self.assertEqual(PickupDate.objects.count(), 0)
        self.assertEqual(History.objects.count(), 1)
