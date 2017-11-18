import json

from channels import Channel
from django.db.models import Q
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from foodsaving.conversations.models import ConversationParticipant, ConversationMessage
from foodsaving.conversations.serializers import ConversationMessageSerializer
from foodsaving.subscriptions.fcm import notify_multiple_devices
from foodsaving.subscriptions.models import ChannelSubscription, PushSubscription


@receiver(post_save, sender=ConversationMessage)
def send_messages(sender, instance, **kwargs):
    """When there is a message in a conversation we need to send it to any subscribed participants."""

    message = instance
    conversation = message.conversation

    topic = 'conversations:message'
    payload = ConversationMessageSerializer(message).data

    push_exclude_users = []

    for subscription in ChannelSubscription.objects.filter(user__in=conversation.participants.all()):

        # TODO: add back in once https://github.com/yunity/karrot-frontend/issues/770 is implemented
        # if not subscription.away_at:
        #     push_exclude_users.append(subscription.user)

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

    notify_multiple_devices(
        registration_ids=tokens,
        message_title='{}: {}'.format(message.author.display_name, message.content),
        # this causes each notification for a given conversation to replace previous notifications so they don't build
        # up too much. fancier would be to make the new notifications show a summary not just the latest message.
        tag='conversation:{}'.format(conversation.id)
    )


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
