from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.db.models import TextField, DateTimeField, Manager
from django.utils import timezone
from timezone_field import TimeZoneField

from foodsaving.base.base_models import BaseModel, LocationModel
from foodsaving.conversations.models import ConversationMixin
from foodsaving.history.models import History, HistoryTypus


class Group(BaseModel, LocationModel, ConversationMixin):
    name = models.CharField(max_length=settings.NAME_MAX_LENGTH, unique=True)
    description = models.TextField(blank=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='groups', through='GroupMembership')
    password = models.CharField(max_length=255, blank=True)
    public_description = models.TextField(blank=True)
    active = models.BooleanField(default=True)
    sent_summary_up_to = DateTimeField(null=True)
    timezone = TimeZoneField(default='Europe/Berlin', null=True, blank=True)
    active_agreement = models.OneToOneField(
        'groups.Agreement',
        related_name='active_group',
        null=True,
        on_delete=models.SET_NULL
    )

    def __str__(self):
        return 'Group {}'.format(self.name)

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
        return not user.is_anonymous and GroupMembership.objects.filter(group=self, user=user).exists()

    def is_member_with_role(self, user, role_name):
        return not user.is_anonymous and GroupMembership.objects.filter(group=self, user=user,
                                                                        roles__contains=[role_name]).exists()

    def accept_invite(self, user, invited_by, invited_at):
        self.add_member(user, history_payload={
            'invited_by': invited_by.id,
            'invited_at': invited_at.isoformat(),
            'invited_via': 'e-mail'
        })


class Agreement(BaseModel):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    title = TextField()
    content = TextField()
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='agreements', through='UserAgreement')


class UserAgreement(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    agreement = models.ForeignKey(Agreement, on_delete=models.CASCADE)


class GroupNotificationType(object):
    WEEKLY_SUMMARY = 'weekly_summary'
    DAILY_PICKUP_NOTIFICATION = 'daily_pickup_notification'


def get_default_notification_types():
    return [
        GroupNotificationType.WEEKLY_SUMMARY,
        GroupNotificationType.DAILY_PICKUP_NOTIFICATION,
    ]


class GroupMembershipManager(Manager):

    def with_notification_type(self, type):
        return self.filter(notification_types__contains=[type])


class GroupMembership(BaseModel):
    objects = GroupMembershipManager()

    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    roles = ArrayField(TextField(), default=list)
    lastseen_at = DateTimeField(default=timezone.now)
    notification_types = ArrayField(TextField(), default=get_default_notification_types)

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

    def add_notification_types(self, notification_types):
        for notification_type in notification_types:
            if notification_type not in self.notification_types:
                self.notification_types.append(notification_type)

    def remove_notification_types(self, notification_types):
        for notification_type in notification_types:
            while notification_type in self.notification_types:
                self.notification_types.remove(notification_type)
