from django.core.management.base import BaseCommand

from yunity.stores.models import PickupDateSeries


class Command(BaseCommand):

    def handle(self, *args, **options):
        PickupDateSeries.objects.create_all_pickup_dates()
