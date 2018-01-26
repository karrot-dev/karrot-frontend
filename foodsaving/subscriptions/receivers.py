import json
from collections import namedtuple

from channels import Channel
from django.db.models import Q
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from foodsaving.conversations.models import ConversationParticipant, ConversationMessage
from foodsaving.conversations.serializers import ConversationMessageSerializer, ConversationSerializer
from foodsaving.groups.models import Group
from foodsaving.subscriptions.fcm import notify_multiple_devices
from foodsaving.subscriptions.models import ChannelSubscription, PushSubscription


MockRequest = namedtuple('Request', ['user'])


@receiver(post_save, sender=ConversationMessage)
def send_messages(sender, instance, **kwargs):
    """When there is a message in a conversation we need to send it to any subscribed participants."""

    message = instance
    conversation = message.conversation

    topic = 'conversations:message'
    payload = ConversationMessageSerializer(message).data

    push_exclude_users = []

    for subscription in ChannelSubscription.objects.recent().filter(user__in=conversation.participants.all()):
        if not subscription.away_at:
            push_exclude_users.append(subscription.user)

        Channel(subscription.reply_channel).send({
            "text": json.dumps({
                'topic': topic,
                'payload': payload
            })
        })

    tokens = [item.token for item in
              PushSubscription.objects.filter(
                  Q(user__in=conversation.participants.all()) & ~Q(user__in=push_exclude_users) & ~Q(
                      user=message.author))]

    if len(tokens) > 0:

        message_title = message.author.display_name
        if isinstance(conversation.target, Group):
            message_title = '{} / {}'.format(conversation.target.name, message_title)

        notify_multiple_devices(
            registration_ids=tokens,
            message_title=message_title,
            message_body=message.content,
            # this causes each notification for a given conversation to replace previous notifications
            # fancier would be to make the new notifications show a summary not just the latest message
            tag='conversation:{}'.format(conversation.id)
        )

    # Send conversations object to participants after sending a message
    # (important for unread_message_count)
    # Exclude the author because their seen_up_to status gets updated,
    # so they will receive the `send_conversation_update` message
    topic = 'conversations:conversation'

    for subscription in ChannelSubscription.objects.recent()\
            .filter(user__in=conversation.participants.all())\
            .exclude(user=message.author):
        payload = ConversationSerializer(conversation, context={'request': MockRequest(user=subscription.user)}).data
        Channel(subscription.reply_channel).send({
            'text': json.dumps({
                'topic': topic,
                'payload': payload
            })
        })


@receiver(post_save, sender=ConversationParticipant)
def send_conversation_update(sender, instance, **kwargs):
    # Update conversations object for user after updating their participation
    # (important for seen_up_to and unread_message_count)
    conversation = instance.conversation

    topic = 'conversations:conversation'
    payload = ConversationSerializer(conversation, context={'request': MockRequest(user=instance.user)}).data

    for subscription in ChannelSubscription.objects.recent().filter(user=instance.user):
        Channel(subscription.reply_channel).send({
            'text': json.dumps({
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
            'text': json.dumps({
                'topic': 'conversations:leave',
                'payload': {
                    'id': conversation.id
                }
            })
        })
