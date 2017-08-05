from django.db.models.signals import m2m_changed
from django.dispatch import receiver

from foodsaving.conversations.models import Conversation
from foodsaving.groups.models import Group
from foodsaving.invitations.signals import invitation_accepted
from foodsaving.users.api import pre_user_delete
from foodsaving.users.models import User


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


@receiver(m2m_changed, sender='groups.Group_members')
def group_membership_change(**kwargs):
    action = kwargs.get('action')
    group = kwargs.get('instance')
    user_ids = kwargs.get('pk_set')

    if action == 'post_add':
        if not group.conversation:
            group.conversation = Conversation.objects.create()
            group.save()
        for id in user_ids:
            user = User.objects.get(pk=id)
            group.conversation.join(user)

    elif action == 'pre_remove':
        if group.conversation:
            for id in user_ids:
                user = User.objects.get(pk=id)
                group.conversation.leave(user)
