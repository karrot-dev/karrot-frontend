from django.core.management.base import BaseCommand

from foodsaving.stores.models import PickupDate


class Command(BaseCommand):

    def handle(self, *args, **options):
        PickupDate.objects.delete_old_pickup_dates()
