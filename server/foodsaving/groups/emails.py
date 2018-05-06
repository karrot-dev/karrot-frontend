import itertools

from dateutil.relativedelta import relativedelta
from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.db.models import Count
from django.utils import timezone
from django.utils.timezone import get_current_timezone

from config import settings
from foodsaving.conversations.models import ConversationMessage
from foodsaving.groups.models import Group, GroupNotificationType, GroupMembership
from foodsaving.pickups.models import PickupDate, Feedback
from foodsaving.utils.email_utils import prepare_email
from foodsaving.utils.frontend_urls import group_wall_url, group_settings_url


def prepare_group_summary_data(group, from_date, to_date):
    new_users = group.members.filter(
        groupmembership__created_at__gte=from_date,
        groupmembership__created_at__lt=to_date,
    ).all()

    pickup_filters = {
        'deleted': False,
        'store__group': group,
        'date__gte': from_date,
        'date__lt': to_date,
    }

    pickups_done_count = PickupDate.objects.annotate(
        num_collectors=Count('collectors')
    ).filter(
        **pickup_filters,
        num_collectors__gt=0,
    ).count()

    pickups_missed_count = PickupDate.objects.annotate(
        num_collectors=Count('collectors')
    ).filter(
        **pickup_filters,
        num_collectors=0,
    ).count()

    feedbacks = Feedback.objects.filter(
        created_at__gte=from_date,
        created_at__lt=to_date,
        about__store__group=group,
    )

    messages = ConversationMessage.objects.filter(
        conversation__target_type=ContentType.objects.get_for_model(Group),
        conversation__target_id=group.id,
        created_at__gte=from_date,
        created_at__lt=to_date,
    )

    data = {
        # minus one second so it's displayed as the full day
        'to_date': to_date - relativedelta(seconds=1),
        'from_date': from_date,
        'group': group,
        'new_users': new_users,
        'pickups_done_count': pickups_done_count,
        'pickups_missed_count': pickups_missed_count,
        'feedbacks': feedbacks,
        'messages': messages,
        'settings_url': group_settings_url(group),
    }

    data['has_activity'] = any(data[field] > 0 for field in ['pickups_done_count', 'pickups_missed_count']) or \
        any(len(data[field]) > 0 for field in ['feedbacks', 'messages', 'new_users'])

    return data


def prepare_group_summary_emails(group, context):
    """Prepares one email per language"""

    members = group.members.filter(
        groupmembership__in=GroupMembership.objects.active().with_notification_type(
            GroupNotificationType.WEEKLY_SUMMARY
        )
    ).exclude(
        groupmembership__user__in=get_user_model().objects.unverified_or_ignored()
    )

    grouped_members = itertools.groupby(members.order_by('language'), key=lambda member: member.language)
    return [
        prepare_email(
            template='group_summary',
            context=context,
            to=[member.email for member in members],
            language=language
        ) for (language, members) in grouped_members
    ]


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


def prepare_user_inactive_in_group_email(user, group):

    return prepare_email(
        'user_inactive_in_group',
        user=user,
        context={
            'group_name': group.name,
            'group_url': group_wall_url(group),
            'num_days_inactive': settings.NUMBER_OF_DAYS_UNTIL_INACTIVE_IN_GROUP,
        }
    )
