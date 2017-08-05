from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

from foodsaving.conversations.models import ConversationParticipant, ConversationReplyChannel, ConversationMessage

from channels import Channel, Group as ChannelGroup
import json


@receiver(post_save, sender=ConversationParticipant)
def add_participant(sender, instance, **kwargs):
    """When a user is added to a conversation, we need to register all their reply channels in the channel groups."""

    user = instance.user
    conversation = instance.conversation
    for item in ConversationReplyChannel.objects.filter(user=user):

        # add the user to the channel group for this conversation
        ChannelGroup(channel_name(conversation)).add(item.reply_channel)

        # notify the user they are now in this conversation
        Channel(item.reply_channel).send({
            'text': json.dumps({
                'topic': 'conversations:join',
                'payload': {
                    'id': conversation.id
                }
            })
        })


@receiver(pre_delete, sender=ConversationParticipant)
def remove_participant(sender, instance, **kwargs):
    """When a user is removed from a conversation we need to deregister their reply channels from the channel groups."""

    user = instance.user
    conversation = instance.conversation
    for item in ConversationReplyChannel.objects.filter(user=user):

        # remove the user from the channel group for the conversation
        ChannelGroup(channel_name(conversation)).discard(item.reply_channel)

        # notify the user they have left this conversation
        Channel(item.reply_channel).send({
            'text': json.dumps({
                'topic': 'conversations:leave',
                'payload': {
                    'id': conversation.id
                }
            })
        })


@receiver(post_save, sender=ConversationMessage)
def send_messages(sender, instance, **kwargs):
    """When there is a message in a conversation we need to send it to the relevent channel group."""

    message = instance
    conversation = message.conversation
    print('sending message on channel {}', channel_name(conversation))

    topic = 'conversations:message'
    payload = {
        'id': message.id,
        'content': message.content,
        'author': message.author.id,
        'conversation': {
            'id': conversation.id
        }
    }

    ChannelGroup(channel_name(conversation)).send({
        "text": json.dumps({
            'topic': topic,
            'payload': payload
        })
    })


def channel_name(conversation):
    return "conversation.{}".format(conversation.id)
