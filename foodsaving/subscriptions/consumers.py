from channels.auth import channel_session_user_from_http, channel_session_user
from django.utils import timezone

from foodsaving.subscriptions.models import ChannelSubscription


@channel_session_user_from_http
def ws_connect(message):
    """The user has connected! Register their channel subscription."""
    user = message.user
    if not user.is_anonymous():
        ChannelSubscription.objects.create(user=user, reply_channel=message.reply_channel)
    message.reply_channel.send({"accept": True})


@channel_session_user
def ws_message(message):
    """They sent us a websocket message! We just update the ChannelSubscription lastseen time.."""
    user = message.user
    if not user.is_anonymous():
        reply_channel = message.reply_channel.name
        ChannelSubscription.objects.filter(user=user, reply_channel=reply_channel).update(lastseen_at=timezone.now())
    message.reply_channel.send({"accept": True})


@channel_session_user
def ws_disconnect(message):
    """The user has disconnected so we remove all their ChannelSubscriptions"""
    user = message.user
    if not user.is_anonymous():
        ChannelSubscription.objects.filter(user=user, reply_channel=message.reply_channel).delete()
    message.reply_channel.send({"accept": True})
