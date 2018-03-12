from anymail.exceptions import AnymailAPIError
from huey.contrib.djhuey import db_task
from raven.contrib.django.raven_compat.models import client as sentry_client

from foodsaving.conversations.models import ConversationParticipant
from foodsaving.groups.models import Group, GroupMembership
from foodsaving.users.models import User
from foodsaving.utils import email_utils


@db_task()
def notify_participants(message):
    participants_to_notify = ConversationParticipant.objects.filter(
        conversation=message.conversation,
        email_notifications=True,
    ).exclude(
        user=message.author
    ).exclude(
        user__in=User.objects.unverified_or_ignored(),
    )

    if isinstance(message.conversation.target, Group):
        # if it's a group conversation, only send to users who are active in that group
        participants_to_notify = participants_to_notify.filter(
            user__groupmembership__in=GroupMembership.objects.active(),
            user__groupmembership__group=message.conversation.target,
        )

    for participant in participants_to_notify:
        try:
            email_utils.prepare_conversation_message_notification(user=participant.user, message=message).send()
        except AnymailAPIError:
            sentry_client.captureException()
