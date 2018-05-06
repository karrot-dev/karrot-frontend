from dateutil.relativedelta import relativedelta
from django.db.models import Count, F, QuerySet
from django.utils import timezone
from huey import crontab
from huey.contrib.djhuey import db_periodic_task

from foodsaving.groups.models import Group, GroupMembership, GroupNotificationType
from foodsaving.pickups import stats
from foodsaving.pickups.emails import prepare_pickup_notification_email
from foodsaving.pickups.models import PickupDate
from foodsaving.stores.models import StoreStatus
from foodsaving.users.models import User
from foodsaving.utils import stats_utils


def fetch_user_pickups(group, user, start_date, end_date):
    return PickupDate.objects.filter(
        store__status=StoreStatus.ACTIVE.value,
        store__group=group,
        date__gte=start_date,
        date__lt=end_date,
        collectors__in=[user],
    ).order_by('date')


@db_periodic_task(crontab(minute=0))  # we check every hour
def daily_pickup_notifications():
    stats_utils.periodic_task('pickups__daily_pickup_notifications')

    for group in Group.objects.all():
        with timezone.override(group.timezone):
            if timezone.localtime().hour is not 20:  # only at 8pm local time
                continue

            for data in fetch_pickup_notification_data_for_group(group):
                prepare_pickup_notification_email(**data).send()
                stats.pickup_notification_email(
                    group=data['group'],
                    **{k: v.count() for k, v in data.items() if isinstance(v, QuerySet)}
                )


def fetch_pickup_notification_data_for_group(group):
    results = []
    localnow = timezone.localtime()

    midnight = localnow.replace(hour=0, minute=0, second=0, microsecond=0) + relativedelta(days=1)
    midnight_tomorrow = midnight + relativedelta(days=1)

    tonight = {'date__gte': localnow, 'date__lt': midnight}
    tomorrow = {'date__gte': midnight, 'date__lt': midnight_tomorrow}

    empty = {'num_collectors': 0}
    not_full = {'num_collectors__gt': 0, 'num_collectors__lt': F('max_collectors')}

    pickups = PickupDate.objects.annotate(
        num_collectors=Count('collectors'),
    ).filter(
        deleted=False,
        store__status=StoreStatus.ACTIVE.value,
        store__group=group,
    ).order_by('date')

    tonight_empty = pickups.filter(**tonight, **empty)
    tomorrow_empty = pickups.filter(**tomorrow, **empty)

    has_empty_pickups = any([v.count() > 0 for v in [tonight_empty, tomorrow_empty]])

    base_tonight_not_full = pickups.filter(**tonight, **not_full)
    base_tomorrow_not_full = pickups.filter(**tomorrow, **not_full)

    users = group.members.filter(
        groupmembership__in=GroupMembership.objects.active().with_notification_type(
            GroupNotificationType.DAILY_PICKUP_NOTIFICATION
        ),
    ).exclude(
        groupmembership__user__in=User.objects.unverified_or_ignored(),
    )

    for user in users:

        user_pickups = PickupDate.objects.filter(
            store__group=group,
            collectors__in=[user],
        ).order_by('date')

        tonight_user = user_pickups.filter(**tonight)
        tomorrow_user = user_pickups.filter(**tomorrow)

        tonight_not_full = base_tonight_not_full.exclude(collectors__in=[user])
        tomorrow_not_full = base_tomorrow_not_full.exclude(collectors__in=[user])

        has_user_pickups = any([
            v.count() > 0 for v in [
                tonight_user,
                tomorrow_user,
                tonight_not_full,
                tomorrow_not_full,
            ]
        ])

        if has_empty_pickups or has_user_pickups:
            results.append({
                'user': user,
                'group': group,
                'tonight_date': localnow,
                'tomorrow_date': midnight,
                'tonight_user': tonight_user,
                'tonight_empty': tonight_empty,
                'tonight_not_full': tonight_not_full,
                'tomorrow_user': tomorrow_user,
                'tomorrow_empty': tomorrow_empty,
                'tomorrow_not_full': tomorrow_not_full,
            })

    return results
