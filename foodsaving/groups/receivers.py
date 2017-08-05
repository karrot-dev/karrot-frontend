from django.db.models.signals import m2m_changed, post_save, pre_delete
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


@receiver(post_save, sender=Group)
def group_created(**kwargs):
    """Ensure every group has a conversation."""
    group = kwargs.get('instance')
    conversation = Conversation.objects.get_or_create_for_target(group)
    conversation.sync_users(group.members.all())

@receiver(pre_delete, sender=Group)
def group_deleted(**kwargs):
    """Delete the conversation when the group is deleted."""
    group = kwargs.get('instance')
    conversation = Conversation.objects.get_for_target(group)
    if conversation:
        conversation.delete()

@receiver(m2m_changed, sender='groups.Group_members')
def group_membership_change(**kwargs):
    """Keep the conversation participants up to date with the group members."""

    action = kwargs.get('action')
    group = kwargs.get('instance')
    user_ids = kwargs.get('pk_set')

    if action == 'post_add':
        conversation = Conversation.objects.get_or_create_for_target(group)
        for user in User.objects.filter(pk__in=user_ids):
            conversation.join(user)

    elif action == 'pre_remove':
        conversation = Conversation.objects.get_for_target(group)
        if conversation:
            for user in User.objects.filter(pk__in=user_ids):
                conversation.leave(user)
