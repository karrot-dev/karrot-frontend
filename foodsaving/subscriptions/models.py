from django.db.models import ForeignKey, TextField, DateTimeField
from django.utils import timezone

from config import settings
from foodsaving.base.base_models import BaseModel


class ChannelSubscription(BaseModel):
    """A subscription to receive messages over a django channel."""
    user = ForeignKey(settings.AUTH_USER_MODEL)
    reply_channel = TextField() # django channels channel
    lastseen_at = DateTimeField(default=timezone.now, null=True)