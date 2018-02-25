from dateutil.relativedelta import relativedelta
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.utils.timezone import now

from foodsaving.conversations.models import ConversationParticipant, ConversationMessage
from foodsaving.utils import email_utils
from foodsaving.webhooks.models import EmailEvent


@receiver(post_save, sender=ConversationMessage)
def mark_as_read(sender, instance, **kwargs):
    """Mark sent messages as read for the author"""

    message = instance
    participant = ConversationParticipant.objects.get(
        user=message.author,
        conversation=message.conversation
    )

    participant.seen_up_to = message
    participant.save()


@receiver(post_save, sender=ConversationMessage)
def notify_participants(sender, instance, **kwargs):
    message = instance

    if not message.conversation.target:
        return

    # exclude emails that had bounces or similar events recently
    ignored_addresses = EmailEvent.objects.filter(created_at__gte=now() - relativedelta(months=6)).values('address')

    participants_to_notify = ConversationParticipant.objects.filter(
        conversation=message.conversation,
        email_notifications=True,
        # only send to Nick and Tilmann for now
        # remove once https://github.com/yunity/karrot-backend/issues/490 is done
        user__id__in=[222, 8]
    ).exclude(
        user=message.author
    ).exclude(
        user__email__in=ignored_addresses
    )

    for participant in participants_to_notify:
        email_utils.prepare_conversation_message_notification(user=participant.user, message=message).send()


@receiver(post_save, sender=ConversationParticipant)
def set_conversation_updated_at_on_create(sender, instance, **kwargs):
    if kwargs['created']:
        participant = instance
        participant.conversation.save()


@receiver(pre_delete, sender=ConversationParticipant)
def set_conversation_updated_at_on_delete(sender, instance, **kwargs):
    participant = instance
    participant.conversation.save()
