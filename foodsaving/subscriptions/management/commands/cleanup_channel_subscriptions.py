from dateutil.relativedelta import relativedelta
from django.core.management.base import BaseCommand
from django.utils import timezone

from foodsaving.subscriptions.models import ChannelSubscription


class Command(BaseCommand):
    """If we have not received a message on the channel for a while, we delete our entries."""

    def handle(self, *args, **options):
        ChannelSubscription.objects.filter(lastseen_at__lt=timezone.now() - relativedelta(minutes=5)).delete()
