import itertools

from dateutil.relativedelta import relativedelta
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.db.models import Count
from django.utils import timezone
from django.utils.timezone import get_current_timezone

from config import settings
from foodsaving.conversations.models import ConversationMessage
from foodsaving.groups.models import Group, GroupNotificationType
from foodsaving.pickups.models import PickupDate
from foodsaving.utils.email_utils import prepare_email


def prepare_group_summary_data(group, from_date, to_date):
    new_users = group.members.filter(
        groupmembership__created_at__gte=from_date,
        groupmembership__created_at__lt=to_date,
    ).all()

    pickups_done_count = PickupDate.objects \
        .annotate(num_collectors=Count('collectors')) \
        .filter(store__group=group,
                date__gte=from_date,
                date__lt=to_date,
                num_collectors__gt=0).count()

    pickups_missed_count = PickupDate.objects \
        .annotate(num_collectors=Count('collectors')) \
        .filter(store__group=group,
                date__gte=from_date,
                date__lt=to_date,
                num_collectors=0).count()

    messages = ConversationMessage.objects.filter(
        conversation__target_type=ContentType.objects.get_for_model(Group),
        conversation__target_id=group.id,
        created_at__gte=from_date,
        created_at__lt=to_date,
    )

    settings_url = '{hostname}/#/group/{group_id}/settings'.format(
        hostname=settings.HOSTNAME,
        group_id=group.id,
    )

    return {
        # minus one second so it's displayed as the full day
        'to_date': to_date - relativedelta(seconds=1),
        'from_date': from_date,
        'group': group,
        'new_users': new_users,
        'pickups_done_count': pickups_done_count,
        'pickups_missed_count': pickups_missed_count,
        'messages': messages,
        'settings_url': settings_url,
    }


def prepare_group_summary_emails(group, from_date, to_date):
    """Prepares one email per language"""
    context = prepare_group_summary_data(group, from_date, to_date)

    members = group \
        .members_with_notification_type(GroupNotificationType.WEEKLY_SUMMARY) \
        .exclude(groupmembership__user__in=get_user_model().objects.unverified_or_ignored())

    grouped_members = itertools.groupby(members.order_by('language'), key=lambda member: member.language)
    return [prepare_email(template='group_summary',
                          context=context,
                          to=[member.email for member in members],
                          language=language) for (language, members) in grouped_members]


def calculate_group_summary_dates(group):
    with timezone.override(group.timezone):
        tz = get_current_timezone()

        # midnight last night in the groups local timezone
        midnight = tz.localize(timezone.now().replace(
            tzinfo=None, hour=0, minute=0, second=0, microsecond=0
        ))

        # 7 days before that
        from_date = midnight - relativedelta(days=7)

        # a week after from date
        to_date = from_date + relativedelta(days=7)

        return from_date, to_date
