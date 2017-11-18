from dateutil.relativedelta import relativedelta
from django.core.management import call_command
from django.test import TestCase
from django.utils import timezone

from foodsaving.subscriptions.models import ChannelSubscription
from foodsaving.users.factories import UserFactory


class CleanupChannelCommandTests(TestCase):
    def setUp(self):
        self.user = UserFactory()
        self.subscription = ChannelSubscription.objects.create(user=self.user, reply_channel='foo')

    def test_keeps_recent_entries(self):
        self.set_lastseen_ago_in_minutes(3)
        call_command('cleanup_channel_subscriptions')
        self.assertIsNotNone(ChannelSubscription.objects.get(pk=self.subscription.id))

    def test_deletes_old_entries(self):
        self.set_lastseen_ago_in_minutes(10)
        call_command('cleanup_channel_subscriptions')
        with self.assertRaises(ChannelSubscription.DoesNotExist):
            self.assertIsNone(ChannelSubscription.objects.get(pk=self.subscription.id))

    def set_lastseen_ago_in_minutes(self, minutes):
        self.subscription.lastseen_at = timezone.now() - relativedelta(minutes=minutes)
        self.subscription.save()
