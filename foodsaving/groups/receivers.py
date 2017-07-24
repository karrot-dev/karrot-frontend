from django.dispatch import receiver

from foodsaving.groups.models import Group
from foodsaving.invitations.signals import invitation_accepted
from foodsaving.users.api import pre_user_delete


@receiver(pre_user_delete)
def delete_user_handler(sender, **kwargs):
    user = kwargs.get('user')
    for _ in Group.objects.filter(members__in=[user, ]):
        _.members.remove(user)


@receiver(invitation_accepted)
def handle_invitation_accepted(sender, **kwargs):
    group = kwargs['group']
    user = kwargs['accepted_user']
    group.add_member(user, history_payload={
        'invited_by': kwargs['invited_by'].id,
        'invited_at': kwargs['invited_at'].isoformat(),
        'invited_via': 'e-mail'
    })
