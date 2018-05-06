from email.utils import formataddr

from django.utils import translation

from config import settings
from foodsaving.groups.models import Group
from foodsaving.utils.email_utils import prepare_email
from foodsaving.utils.frontend_urls import group_wall_url, conversation_mute_url
from foodsaving.webhooks.api import make_local_part


def prepare_conversation_message_notification(user, message):
    if not isinstance(message.conversation.target, Group):
        raise Exception('Cannot send message notification if conversation does not belong to a group')

    group = message.conversation.target

    reply_to_name = group.name
    conversation_name = group.name

    local_part = make_local_part(message.conversation, user)
    reply_to = formataddr((reply_to_name, '{}@{}'.format(local_part, settings.SPARKPOST_RELAY_DOMAIN)))
    from_email = formataddr((message.author.display_name, settings.DEFAULT_FROM_EMAIL))

    with translation.override(user.language):
        return prepare_email(
            'conversation_message_notification',
            from_email=from_email,
            user=user,
            reply_to=[reply_to],
            context={
                'conversation_name': conversation_name,
                'author': message.author,
                'message_content': message.content_rendered(),
                'conversation_url': group_wall_url(group),
                'mute_url': conversation_mute_url(group, message.conversation)
            }
        )
