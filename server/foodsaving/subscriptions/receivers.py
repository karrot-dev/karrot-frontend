import json
from collections import namedtuple

from channels import Channel
from django.conf import settings
from django.db.models import Q
from django.db.models.signals import post_save, pre_delete, m2m_changed
from django.dispatch import receiver

from foodsaving.conversations.models import ConversationParticipant, ConversationMessage
from foodsaving.conversations.serializers import ConversationMessageSerializer, ConversationSerializer
from foodsaving.groups.models import Group
from foodsaving.groups.serializers import GroupDetailSerializer, GroupPreviewSerializer
from foodsaving.history.models import history_created
from foodsaving.history.serializers import HistorySerializer
from foodsaving.invitations.models import Invitation
from foodsaving.invitations.serializers import InvitationSerializer
from foodsaving.pickups.models import PickupDate, PickupDateSeries, Feedback, pickup_done
from foodsaving.pickups.serializers import PickupDateSerializer, PickupDateSeriesSerializer, FeedbackSerializer
from foodsaving.stores.models import Store
from foodsaving.stores.serializers import StoreSerializer
from foodsaving.subscriptions.fcm import notify_multiple_devices
from foodsaving.subscriptions.models import ChannelSubscription, PushSubscription
from foodsaving.userauth.serializers import AuthUserSerializer
from foodsaving.users.serializers import UserSerializer

MockRequest = namedtuple('Request', ['user'])


class AbsoluteURIBuildingRequest:

    def build_absolute_uri(self, path):
        return settings.HOSTNAME + path


def send_in_channel(channel, topic, payload):
    Channel(channel).send({
        'text': json.dumps({
            'topic': topic,
            'payload': payload
        })
    })


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

        send_in_channel(subscription.reply_channel, topic, payload)

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
        send_in_channel(subscription.reply_channel, topic, payload)


@receiver(post_save, sender=ConversationParticipant)
def send_conversation_update(sender, instance, **kwargs):
    # Update conversations object for user after updating their participation
    # (important for seen_up_to and unread_message_count)
    conversation = instance.conversation

    topic = 'conversations:conversation'
    payload = ConversationSerializer(conversation, context={'request': MockRequest(user=instance.user)}).data

    for subscription in ChannelSubscription.objects.recent().filter(user=instance.user):
        send_in_channel(subscription.reply_channel, topic, payload)


@receiver(pre_delete, sender=ConversationParticipant)
def remove_participant(sender, instance, **kwargs):
    """When a user is removed from a conversation we will notify them."""

    user = instance.user
    conversation = instance.conversation
    for subscription in ChannelSubscription.objects.filter(user=user):
        send_in_channel(
            subscription.reply_channel,
            topic='conversations:leave',
            payload={
                'id': conversation.id
            }
        )


# Group
@receiver(post_save, sender=Group)
def send_group_updates(sender, instance, **kwargs):
    group = instance
    detail_payload = GroupDetailSerializer(group).data
    for subscription in ChannelSubscription.objects.recent().filter(user__in=group.members.all()):
        send_in_channel(subscription.reply_channel, topic='groups:group_detail', payload=detail_payload)

    preview_payload = GroupPreviewSerializer(group).data
    for subscription in ChannelSubscription.objects.recent():
        send_in_channel(subscription.reply_channel, topic='groups:group_preview', payload=preview_payload)


# Invitations
@receiver(post_save, sender=Invitation)
def send_invitation_updates(sender, instance, **kwargs):
    invitation = instance
    payload = InvitationSerializer(invitation).data
    for subscription in ChannelSubscription.objects.recent().filter(user__in=invitation.group.members.all()):
        send_in_channel(subscription.reply_channel, topic='invitations:invitation', payload=payload)


@receiver(pre_delete, sender=Invitation)
def send_invitation_accept(sender, instance, **kwargs):
    invitation = instance
    payload = InvitationSerializer(invitation).data
    for subscription in ChannelSubscription.objects.recent().filter(user__in=invitation.group.members.all()):
        send_in_channel(subscription.reply_channel, topic='invitations:invitation_accept', payload=payload)


# Store
@receiver(post_save, sender=Store)
def send_store_updates(sender, instance, **kwargs):
    store = instance
    payload = StoreSerializer(store).data
    for subscription in ChannelSubscription.objects.recent().filter(user__in=store.group.members.all()):
        send_in_channel(subscription.reply_channel, topic='stores:store', payload=payload)


# Pickup Dates
@receiver(post_save, sender=PickupDate)
def send_pickup_updates(sender, instance, **kwargs):
    pickup = instance
    if pickup.done_and_processed:
        # doesn't change serialized data
        return

    payload = PickupDateSerializer(pickup).data
    for subscription in ChannelSubscription.objects.recent().filter(user__in=pickup.store.group.members.all()):
        if not pickup.deleted:
            send_in_channel(subscription.reply_channel, topic='pickups:pickupdate', payload=payload)
        else:
            send_in_channel(subscription.reply_channel, topic='pickups:pickupdate_deleted', payload=payload)


@receiver(m2m_changed, sender=PickupDate.collectors.through)
def send_pickup_collector_updates(sender, instance, **kwargs):
    action = kwargs.get('action')
    if action and (action == 'post_add' or action == 'post_remove'):
        pickup = instance
        payload = PickupDateSerializer(pickup).data
        for subscription in ChannelSubscription.objects.recent().filter(user__in=pickup.store.group.members.all()):
            send_in_channel(subscription.reply_channel, topic='pickups:pickupdate', payload=payload)


# Pickup Date Series
@receiver(post_save, sender=PickupDateSeries)
def send_pickup_series_updates(sender, instance, **kwargs):
    series = instance
    payload = PickupDateSeriesSerializer(series).data
    for subscription in ChannelSubscription.objects.recent().filter(user__in=series.store.group.members.all()):
        send_in_channel(subscription.reply_channel, topic='pickups:series', payload=payload)


@receiver(pre_delete, sender=PickupDateSeries)
def send_pickup_series_delete(sender, instance, **kwargs):
    series = instance
    payload = PickupDateSeriesSerializer(series).data
    for subscription in ChannelSubscription.objects.recent().filter(user__in=series.store.group.members.all()):
        send_in_channel(subscription.reply_channel, topic='pickups:series_deleted', payload=payload)


# Feedback
@receiver(post_save, sender=Feedback)
def send_feedback_updates(sender, instance, **kwargs):
    feedback = instance
    for subscription in ChannelSubscription.objects.recent().filter(user__in=feedback.about.store.group.members.all()):
        payload = FeedbackSerializer(feedback, context={'request': MockRequest(user=subscription.user)}).data
        send_in_channel(subscription.reply_channel, topic='feedback:feedback', payload=payload)


@receiver(pickup_done)
def send_feedback_possible_updates(sender, instance, **kwargs):
    pickup = instance
    payload = PickupDateSerializer(pickup).data
    for subscription in ChannelSubscription.objects.recent().filter(user__in=pickup.collectors.all()):
        send_in_channel(subscription.reply_channel, topic='pickups:feedback_possible', payload=payload)


# Users
@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def send_auth_user_updates(sender, instance, **kwargs):
    """Send full details to the user"""
    user = instance
    payload = AuthUserSerializer(user, context={'request': AbsoluteURIBuildingRequest()}).data
    for subscription in ChannelSubscription.objects.recent().filter(user=user):
        send_in_channel(subscription.reply_channel, topic='auth:user', payload=payload)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def send_user_updates(sender, instance, **kwargs):
    """Send profile updates to everyone except the user"""
    user = instance
    payload = UserSerializer(user, context={'request': AbsoluteURIBuildingRequest()}).data
    users_groups = user.groups.values('id')
    for subscription in ChannelSubscription.objects.recent().filter(user__groups__in=users_groups).exclude(user=user):
        send_in_channel(subscription.reply_channel, topic='users:user', payload=payload)


# History
@receiver(history_created)
def send_history_updates(sender, instance, **kwargs):
    history = instance
    payload = HistorySerializer(history).data
    for subscription in ChannelSubscription.objects.recent().filter(user__in=history.group.members.all()):
        send_in_channel(subscription.reply_channel, topic='history:history', payload=payload)

