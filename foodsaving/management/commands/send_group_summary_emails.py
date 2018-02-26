import traceback

from django.core.management.base import BaseCommand
from django.db.models import Count

from foodsaving.groups.models import Group
from foodsaving.utils import email_utils


class Command(BaseCommand):

    def handle(self, *args, **options):
        groups = Group.objects.annotate(member_count=Count('members')).filter(member_count__gt=0)
        for group in groups:

            from_date, to_date = email_utils.calculate_group_summary_dates(group)

            if not group.sent_summary_up_to or group.sent_summary_up_to < to_date:

                print('sending summary for [{}] {} to {}'.format(group.name, from_date, to_date))

                for email in email_utils.prepare_group_summary_emails(group, from_date, to_date):
                    try:
                        email.send()
                    except Exception:
                        traceback.print_exc()

                group.sent_summary_up_to = to_date
                group.save()
