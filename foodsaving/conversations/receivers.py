from django.db.models.signals import post_save
from django.dispatch import receiver

from foodsaving.conversations.models import ConversationParticipant, ConversationMessage


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
