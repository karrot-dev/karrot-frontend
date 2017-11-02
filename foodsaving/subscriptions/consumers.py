from channels.generic.websockets import JsonWebsocketConsumer
from django.utils import timezone

from foodsaving.subscriptions.models import ChannelSubscription


class Consumer(JsonWebsocketConsumer):
    http_user = True

    def connect(self, message, **kwargs):
        """The user has connected! Register their channel subscription."""
        user = message.user
        if not user.is_anonymous():
            ChannelSubscription.objects.create(user=user, reply_channel=message.reply_channel)
        message.reply_channel.send({"accept": True})

    def receive(self, content, **kwargs):
        """They sent us a websocket message!"""
        user = self.message.user
        if not user.is_anonymous():
            reply_channel = self.message.reply_channel.name
            subscriptions = ChannelSubscription.objects.filter(user=user, reply_channel=reply_channel)
            update_attrs = {'lastseen_at': timezone.now()}
            if 'type' in content:
                if content['type'] == 'away':
                    update_attrs['away_at'] = timezone.now()
                elif content['type'] == 'back':
                    update_attrs['away_at'] = None
            subscriptions.update(**update_attrs)

    def disconnect(self, message, **kwargs):
        """The user has disconnected so we remove all their ChannelSubscriptions"""
        user = message.user
        if not user.is_anonymous():
            ChannelSubscription.objects.filter(user=user, reply_channel=message.reply_channel).delete()
