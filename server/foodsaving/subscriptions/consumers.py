from base64 import b64decode
from urllib.parse import unquote

from channels.generic.websockets import JsonWebsocketConsumer
from django.utils import timezone
from rest_framework.authentication import TokenAuthentication

from foodsaving.subscriptions.models import ChannelSubscription

token_auth = TokenAuthentication()


def check_for_auth_token_header(message):
    prefix = 'karrot.token.value.'
    for header, value in message['headers']:
        if header == b'sec-websocket-protocol':
            protocols = [x.strip() for x in unquote(value.decode('ascii')).split(",")]
            for protocol in protocols:
                if protocol.startswith(prefix):
                    value = protocol[len(prefix):]
                    if len(value) % 4:
                        # not a multiple of 4, add padding:
                        value += '=' * (4 - len(value) % 4)
                    token = b64decode(value).decode('ascii')
                    message.channel_session['auth_token'] = token


def check_for_token_user(message):
    if not message.user or message.user.is_anonymous:
        auth_token = message.channel_session.get('auth_token', None)
        if auth_token:
            user, _ = token_auth.authenticate_credentials(auth_token)
            if user:
                message.user = user


class Consumer(JsonWebsocketConsumer):
    http_user = True

    def connect(self, message, **kwargs):
        """The user has connected! Register their channel subscription."""
        check_for_auth_token_header(message)
        check_for_token_user(message)
        user = message.user
        if not user.is_anonymous:
            ChannelSubscription.objects.create(user=user, reply_channel=message.reply_channel)
        message.reply_channel.send({"accept": True})

    def receive(self, content, **kwargs):
        """They sent us a websocket message!"""
        check_for_token_user(self.message)
        user = self.message.user
        if not user.is_anonymous:
            reply_channel = self.message.reply_channel.name
            subscriptions = ChannelSubscription.objects.filter(user=user, reply_channel=reply_channel)
            update_attrs = {'lastseen_at': timezone.now()}
            message_type = content.get('type', None)
            if message_type == 'away':
                update_attrs['away_at'] = timezone.now()
            elif message_type == 'back':
                update_attrs['away_at'] = None
            subscriptions.update(**update_attrs)

    def disconnect(self, message, **kwargs):
        """The user has disconnected so we remove all their ChannelSubscriptions"""
        user = message.user
        if not user.is_anonymous:
            ChannelSubscription.objects.filter(user=user, reply_channel=message.reply_channel).delete()
