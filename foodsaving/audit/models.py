from django.contrib.postgres.fields import JSONField
from django.db import models
from django.utils import timezone
from django_enumfield import enum

from foodsaving.base.base_models import NicelyFormattedModel


class AuditTypus(enum.Enum):
    GROUP_CREATE = 0
    GROUP_MODIFY = 1
    GROUP_JOIN = 2
    GROUP_LEAVE = 3
    STORE_CREATE = 4
    STORE_MODIFY = 5
    STORE_DELETE = 6
    PICKUP_CREATE = 7
    PICKUP_MODIFY = 8
    PICKUP_DELETE = 9
    SERIES_CREATE = 10
    SERIES_MODIFY = 11
    SERIES_DELETE = 12
    PICKUP_DONE = 13
    PICKUP_JOIN = 14
    PICKUP_LEAVE = 15


class Audit(NicelyFormattedModel):
    date = models.DateTimeField(default=timezone.now)
    typus = enum.EnumField(AuditTypus)
    group = models.ForeignKey('groups.Group')
    store = models.ForeignKey('stores.Store', null=True)
    users = models.ManyToManyField('users.User')
    payload = JSONField(null=True)
