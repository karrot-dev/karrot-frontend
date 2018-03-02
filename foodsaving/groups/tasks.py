from huey import crontab
from huey.contrib.djhuey import db_periodic_task

from foodsaving.groups import stats
from foodsaving.groups.models import Group


@db_periodic_task(crontab(minute='*'))
def record_stats():
    for group in Group.objects.all():
        stats.group_members_stats(group)
        stats.group_stores_stats(group)
