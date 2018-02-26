from dateutil.relativedelta import relativedelta
from django.utils.timezone import now
from huey.contrib.djhuey import db_task

from django.conf import settings
from foodsaving.conversations.models import ConversationParticipant
from foodsaving.utils import email_utils
from foodsaving.webhooks.models import EmailEvent


@db_task()
def notify_participants(message):
    # exclude emails that had bounces or similar events recently
    ignored_addresses = EmailEvent.objects.filter(
        created_at__gte=now() - relativedelta(months=6),
        event__in=settings.EMAIL_EVENTS_AVOID
    ).values('address')

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
