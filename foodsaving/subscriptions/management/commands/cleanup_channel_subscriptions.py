from django.core.management.base import BaseCommand

from foodsaving.subscriptions.models import ChannelSubscription


class Command(BaseCommand):
    """If we have not received a message on the channel for a while, we delete our entries."""

    def handle(self, *args, **options):
        ChannelSubscription.objects.old().delete()
