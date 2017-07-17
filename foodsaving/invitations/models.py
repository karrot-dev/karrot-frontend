import uuid
from datetime import timedelta

from anymail.message import AnymailMessage
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Q
from django.template.loader import render_to_string
from django.utils import timezone

from config import settings
from foodsaving.base.base_models import BaseModel
from foodsaving.invitations.signals import invitation_accepted


class InvitationManager(models.Manager):
    def create_and_send(self, **kwargs):
        invitation = self.create(**kwargs)
        invitation.send_mail()
        return invitation

    def all_expired(self):
        return self.filter(self.expired_q())

    def expired_q(self):
        return Q(expires_at__lt=timezone.now())

    def delete_expired_invitations(self):
        self.all_expired().delete()


def get_default_expiry_date():
    return timezone.now() + timedelta(days=14)


class Invitation(BaseModel):
    token = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    inviter = models.ForeignKey(get_user_model())
    group = models.ForeignKey('groups.Group', on_delete=models.CASCADE)
    expires_at = models.DateTimeField(default=get_default_expiry_date)

    objects = InvitationManager()

    def send_mail(self):
        invite_url = '{hostname}/#!/signup?invite={token}'.format(
            hostname=settings.HOSTNAME,
            token=self.token
        )

        context = {
            'group_name': self.group.name,
            'invite_url': invite_url,
            'email': self.email,
            'inviter_name': self.inviter.display_name,
        }

        AnymailMessage(
            subject=render_to_string('emailinvitation-subject.jinja').replace('\n', ''),
            body=render_to_string('emailinvitation-body-text.jinja', context),
            to=[self.email],
            from_email=settings.DEFAULT_FROM_EMAIL,
            track_clicks=False,
            track_opens=False
        ).send()

    def accept(self, user):
        invitation_accepted.send(
            sender=self.__class__,
            token=self.token,
            email=self.email,
            inviter=self.inviter,
            accepted_user=user,
            group=self.group
        )
        self.delete()

    def expired(self):
        return self.expires_at <= timezone.now()

    def __str__(self):
        return "Invite to {0} by {1}".format(self.group.name, self.inviter.display_name)
