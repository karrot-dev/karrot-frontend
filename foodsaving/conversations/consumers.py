from channels.auth import channel_session_user_from_http, channel_session_user
from django.utils import timezone

from foodsaving.conversations.models import ConversationReplyChannel
from channels import Group as ChannelGroup, Channel
import json


@channel_session_user_from_http
def ws_connect(message):
    """The user has connected so we add them to a channel group for each conversation they are in"""
    message.reply_channel.send({"accept": True})
    user = message.user
    if not user.is_anonymous():
        for conversation in user.conversation_set.all():
            ChannelGroup(channel_name(conversation)).add(message.reply_channel)
            Channel(message.reply_channel.name).send({
                'text': json.dumps({
                    'topic': 'conversations:join',
                    'payload': {
                        'id': conversation.id
                    }
                })
            })

        ConversationReplyChannel.objects.create(user=user, reply_channel=message.reply_channel)


@channel_session_user
def ws_message(message):
    """They sent us a websocket message! We just use them to keep our ConversationReplyChannels lastseen updated."""
    user = message.user
    reply_channel = message.reply_channel.name
    ConversationReplyChannel.objects.filter(user=user, reply_channel=reply_channel).update(lastseen_at=timezone.now())
    message.reply_channel.send({"accept": True})


@channel_session_user
def ws_disconnect(message):
    """The user has disconnected so we remove them from all the channel groups, and delete ConversationReplyChannels"""
    user = message.user
    if not user.is_anonymous():
        for conversation in user.conversation_set.all():
            ChannelGroup(channel_name(conversation)).discard(message.reply_channel)
        ConversationReplyChannel.objects.filter(user=user, reply_channel=message.reply_channel).delete()
    message.reply_channel.send({"accept": True})


def channel_name(conversation):
    return "conversation.{}".format(conversation.id)
