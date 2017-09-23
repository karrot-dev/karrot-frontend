from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models, transaction
from django.db.models import TextField
from django.utils import timezone
from timezone_field import TimeZoneField

from foodsaving.base.base_models import BaseModel, LocationModel
from foodsaving.conversations.models import ConversationMixin
from foodsaving.history.models import History, HistoryTypus


class GroupManager(models.Manager):
    @transaction.atomic
    def send_all_notifications(self):
        for g in self.all():
            g.send_notifications()


class Group(BaseModel, LocationModel, ConversationMixin):
    objects = GroupManager()

    name = models.CharField(max_length=settings.NAME_MAX_LENGTH, unique=True)
    description = models.TextField(blank=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='groups', through='GroupMembership')
    password = models.CharField(max_length=255, blank=True)
    public_description = models.TextField(blank=True)
    timezone = TimeZoneField(default='Europe/Berlin', null=True, blank=True)
    slack_webhook = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return '{}'.format(self.name)

    def send_notifications(self):
        if self.slack_webhook.startswith('https://hooks.slack.com/services/'):
            for s in self.store.all():
                # get all pick-ups within the notification range
                for p in s.pickup_dates.filter(
                        date__lt=timezone.now() + relativedelta(hours=s.upcoming_notification_hours),
                        date__gt=timezone.now()
                ):
                    p.notify_upcoming_via_slack()

    def add_member(self, user, history_payload=None):
        GroupMembership.objects.create(group=self, user=user)
        History.objects.create(
            typus=HistoryTypus.GROUP_JOIN,
            group=self,
            users=[user, ],
            payload=history_payload
        )

    def remove_member(self, user):
        History.objects.create(
            typus=HistoryTypus.GROUP_LEAVE,
            group=self,
            users=[user, ]
        )
        GroupMembership.objects.filter(group=self, user=user).delete()

    def is_member(self, user):
        return not user.is_anonymous() and GroupMembership.objects.filter(group=self, user=user).exists()

    def is_member_with_role(self, user, role_name):
        return not user.is_anonymous() and GroupMembership.objects.filter(group=self, user=user,
                                                                          roles__contains=[role_name]).exists()

    def accept_invite(self, user, invited_by, invited_at):
        self.add_member(user, history_payload={
            'invited_by': invited_by.id,
            'invited_at': invited_at.isoformat(),
            'invited_via': 'e-mail'
        })


class GroupMembership(BaseModel):
    group = models.ForeignKey(Group, on_delete=models.DO_NOTHING)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.DO_NOTHING)
    roles = ArrayField(TextField(), default=list)

    class Meta:
        db_table = 'groups_group_members'
        unique_together = (('group', 'user'),)

    def add_roles(self, roles):
        for role in roles:
            if role not in self.roles:
                self.roles.append(role)

    def remove_roles(self, roles):
        for role in roles:
            while role in self.roles:
                self.roles.remove(role)
