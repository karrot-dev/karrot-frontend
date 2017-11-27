from dateutil.relativedelta import relativedelta
from django.core.management import call_command
from django.utils import timezone
from rest_framework.test import APITestCase

from foodsaving.history.models import History
from foodsaving.pickups.factories import PickupDateFactory
from foodsaving.pickups.models import PickupDate


class TestProcessFinishedPickupDatesCommand(APITestCase):
    def setUp(self):
        self.pickup = PickupDateFactory(date=timezone.now() - relativedelta(weeks=1))

    def test_run_command(self):
        call_command('process_finished_pickup_dates')
        self.assertEqual(PickupDate.objects.count(), 1)
        self.assertEqual(History.objects.count(), 1)
