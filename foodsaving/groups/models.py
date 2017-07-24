from dateutil.relativedelta import relativedelta
from django.db import models, transaction
from django.utils import timezone
from timezone_field import TimeZoneField

from config import settings
from foodsaving.base.base_models import BaseModel, LocationModel
from foodsaving.groups.signals import post_group_join, pre_group_leave


class GroupManager(models.Manager):
    @transaction.atomic
    def send_all_notifications(self):
        for g in self.all():
            g.send_notifications()


class Group(BaseModel, LocationModel):
    objects = GroupManager()

    name = models.CharField(max_length=settings.NAME_MAX_LENGTH, unique=True)
    description = models.TextField(blank=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='groups')
    password = models.CharField(max_length=255, blank=True)
    public_description = models.TextField(blank=True)
    timezone = TimeZoneField(default='Europe/Berlin', null=True, blank=True)
    slack_webhook = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return '{}'.format(self.name)

    def send_notifications(self):
        for s in self.store.all():
            for p in s.pickup_dates.filter(
                date__gt=timezone.now() - relativedelta(hours=s.upcoming_notification_hours)
            ):
                p.notify_upcoming()

    def add_member(self, user, history_payload=None):
        self.members.add(user)
        self.save()  # FIXME save shouldn't be necessary
        post_group_join.send(sender=self.__class__, group=self, user=user, payload=history_payload)

    def remove_member(self, user):
        pre_group_leave.send(sender=self.__class__, group=self, user=user)
        self.members.remove(user)
        self.save()  # FIXME save shouldn't be necessary
