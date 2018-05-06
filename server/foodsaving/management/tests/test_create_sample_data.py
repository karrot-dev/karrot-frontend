from django.core.management import call_command
from django.utils.six import StringIO
from rest_framework.test import APITestCase

from foodsaving.users.models import User


class TestUpdatePickupDatesCommand(APITestCase):
    def test_run_command(self):
        out = StringIO()
        call_command('create_sample_data', '--quick', stdout=out)
        self.assertGreater(User.objects.count(), 0)
