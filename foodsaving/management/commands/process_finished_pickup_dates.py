from django.core.management.base import BaseCommand

from foodsaving.stores.models import PickupDate


class Command(BaseCommand):
    """
    triggers actions when pickup dates are finished
    call this regularly on the server, e.g. via cron-job
    """

    def handle(self, *args, **options):
        PickupDate.objects.process_finished_pickup_dates()
