import traceback

from django.db.models import Count
from huey import crontab
from huey.contrib.djhuey import db_periodic_task
from influxdb_metrics.loader import write_points

from foodsaving.groups import stats, emails
from foodsaving.groups.models import Group


@db_periodic_task(crontab(minute=0))  # every hour
def record_group_stats():
    stats.periodic_task('group__record_group_stats')

    points = []

    for group in Group.objects.all():
        points.extend(stats.get_group_members_stats(group))
        points.extend(stats.get_group_stores_stats(group))

    write_points(points)


@db_periodic_task(crontab(day_of_week=0, hour=8, minute=0))  # send 8am every Sunday
def send_summary_emails():
    stats.periodic_task('group__send_summary_emails')

    groups = Group.objects.annotate(member_count=Count('members')).filter(member_count__gt=0)
    for group in groups:

        from_date, to_date = emails.calculate_group_summary_dates(group)

        if not group.sent_summary_up_to or group.sent_summary_up_to < to_date:

            recipient_count = 0

            for email in emails.prepare_group_summary_emails(group, from_date, to_date):
                try:
                    email.send()
                    recipient_count += len(email.to)
                except Exception:
                    traceback.print_exc()

            # we save this even if some of the email sending, no retries right now basically...
            group.sent_summary_up_to = to_date
            group.save()
            stats.group_summary_email(group, recipient_count)
