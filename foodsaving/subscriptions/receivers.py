from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from channels import Channel, Group as ChannelGroup
import json

from foodsaving.conversations.models import ConversationParticipant, ConversationMessage
from foodsaving.subscriptions.models import ChannelSubscription


@receiver(post_save, sender=ConversationMessage)
def send_messages(sender, instance, **kwargs):
    """When there is a message in a conversation we need to send it to any subscribed participants."""

    message = instance
    conversation = message.conversation

    # TODO: use a serializer
    topic = 'conversations:message'
    payload = {
        'id': message.id,
        'content': message.content,
        'author': message.author.id,
        'conversation': {
            'id': conversation.id
        }
    }

    for item in ChannelSubscription.objects.filter(user__in=conversation.participants.all()):
        Channel(item.reply_channel).send({
            # TODO: use a serializer
            "text": json.dumps({
                'topic': topic,
                'payload': payload
            })
        })


@receiver(pre_delete, sender=ConversationParticipant)
def remove_participant(sender, instance, **kwargs):
    """When a user is removed from a conversation we will notify them."""

    user = instance.user
    conversation = instance.conversation
    for item in ChannelSubscription.objects.filter(user=user):
        Channel(item.reply_channel).send({
            # TODO: use a serializer
            'text': json.dumps({
                'topic': 'conversations:leave',
                'payload': {
                    'id': conversation.id
                }
            })
        })
