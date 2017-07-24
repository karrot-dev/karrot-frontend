import uuid
from datetime import timedelta

from anymail.message import AnymailMessage
from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Q
from django.template.loader import render_to_string
from django.utils import timezone
from furl import furl

from config import settings
from foodsaving.base.base_models import BaseModel
from foodsaving.invitations.signals import invitation_accepted


class InvitationManager(models.Manager):
    def create_and_send(self, **kwargs):
        # Delete all expired invitations before creating new ones.
        # Makes re-sending invitations after experiation possible and saves us from running a periodic cleanup command
        # I wonder if this is a sane decision.
        self.delete_expired_invitations()

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
    class Meta:
        unique_together = ('email', 'group')
    token = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    email = models.EmailField()
    invited_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    group = models.ForeignKey('groups.Group', on_delete=models.CASCADE)
    expires_at = models.DateTimeField(default=get_default_expiry_date)

    objects = InvitationManager()

    def get_email_body(self):
        invite_url = furl('{hostname}/#!/signup'.format(hostname=settings.HOSTNAME))
        invite_url.fragment.args = {
            'invite': self.token,
            'email': self.email
        }

        context = {
            'group_name': self.group.name,
            'invite_url': invite_url,
            'email': self.email,
            'invited_by_name': self.invited_by.display_name,
        }

        return render_to_string('emailinvitation-body-text.jinja', context)

    def send_mail(self):
        AnymailMessage(
            subject=render_to_string('emailinvitation-subject.jinja').replace('\n', ''),
            body=self.get_email_body(),
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
            invited_at=self.created_at,
            invited_by=self.invited_by,
            accepted_user=user,
            group=self.group
        )
        self.delete()

    def expired(self):
        return self.expires_at <= timezone.now()

    def __str__(self):
        return "Invite to {0} by {1}".format(self.group.name, self.invited_by.display_name)
