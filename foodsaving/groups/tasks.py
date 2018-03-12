from datetime import timedelta

from anymail.exceptions import AnymailAPIError
from django.db.models import Count
from django.utils import timezone
from huey import crontab
from huey.contrib.djhuey import db_periodic_task
from influxdb_metrics.loader import write_points
from raven.contrib.django.raven_compat.models import client as sentry_client

from config import settings
from foodsaving.groups import stats, emails
from foodsaving.groups.emails import prepare_user_inactive_in_group_email, prepare_group_summary_data
from foodsaving.groups.models import Group
from foodsaving.groups.models import GroupMembership
from foodsaving.utils import stats_utils


@db_periodic_task(crontab(minute=0))  # every hour
def record_group_stats():
    stats_utils.periodic_task('group__record_group_stats')

    points = []

    for group in Group.objects.all():
        points.extend(stats.get_group_members_stats(group))
        points.extend(stats.get_group_stores_stats(group))

    write_points(points)


@db_periodic_task(crontab(hour=2, minute=0))  # 2am every day
def process_inactive_users():
    now = timezone.now()

    count_users_flagged_inactive = 0

    inactive_threshold_date = now - timedelta(days=settings.NUMBER_OF_DAYS_UNTIL_INACTIVE_IN_GROUP)
    for membership in GroupMembership.objects.filter(lastseen_at__lte=inactive_threshold_date, inactive_at=None):
        email = prepare_user_inactive_in_group_email(membership.user, membership.group)
        email.send()
        membership.inactive_at = now
        membership.save()
        count_users_flagged_inactive += 1

    stats_utils.periodic_task('group__process_inactive_users', {
        'count_users_flagged_inactive': count_users_flagged_inactive,
    })


@db_periodic_task(crontab(day_of_week=0, hour=8, minute=0))  # send 8am every Sunday
def send_summary_emails():
    email_count = 0
    recipient_count = 0

    groups = Group.objects.annotate(member_count=Count('members')).filter(member_count__gt=0)

    for group in groups:

        from_date, to_date = emails.calculate_group_summary_dates(group)

        if not group.sent_summary_up_to or group.sent_summary_up_to < to_date:

            email_recipient_count = 0

            context = prepare_group_summary_data(group, from_date, to_date)
            for email in emails.prepare_group_summary_emails(group, context):
                try:
                    email.send()
                    email_count += 1
                    email_recipient_count += len(email.to)
                except AnymailAPIError:
                    sentry_client.captureException()

            # we save this even if some of the email sending, no retries right now basically...
            group.sent_summary_up_to = to_date
            group.save()

            stats.group_summary_email(
                group,
                email_recipient_count=email_recipient_count,
                feedback_count=context['feedbacks'].count(),
                message_count=context['messages'].count(),
                new_user_count=context['new_users'].count(),
                pickups_done_count=context['pickups_done_count'],
                pickups_missed_count=context['pickups_missed_count'],
            )

            recipient_count += email_recipient_count

    stats_utils.periodic_task('group__send_summary_emails', {
        'recipient_count': recipient_count,
        'email_count': email_count,
    })
