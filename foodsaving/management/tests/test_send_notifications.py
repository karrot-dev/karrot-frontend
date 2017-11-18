import responses
from dateutil.relativedelta import relativedelta
from django.core.management import call_command
from django.utils import timezone
from rest_framework.test import APITestCase

from foodsaving.stores.factories import PickupDateFactory


class TestSendNotifications(APITestCase):
    def setUp(self):
        self.pickup = PickupDateFactory(date=timezone.now() + relativedelta(hours=1))

    @responses.activate
    def test_run_command(self):
        # remember to also call this regularly on the server, e.g. via cron-job
        # This test shouldn't have any effect, as no notifications will be sent without configuring at least a webhook
        call_command('send_notifications')

