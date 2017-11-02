from django.db.models import ForeignKey, TextField, DateTimeField
from django.utils import timezone
from django_enumfield import enum

from django.conf import settings
from foodsaving.base.base_models import BaseModel


class ChannelSubscription(BaseModel):
    """A subscription to receive messages over a django channel."""
    user = ForeignKey(settings.AUTH_USER_MODEL)
    reply_channel = TextField()  # django channels channel
    lastseen_at = DateTimeField(default=timezone.now, null=True)
    away_at = DateTimeField(null=True)


class PushSubscriptionPlatform(enum.Enum):
    ANDROID = 1


class PushSubscription(BaseModel):
    """A subscription to receive messages over an FCM push channel."""

    class Meta:
        unique_together = ('user', 'token')

    user = ForeignKey(settings.AUTH_USER_MODEL)
    token = TextField()  # FCM device registration token
    platform = enum.EnumField(PushSubscriptionPlatform)
