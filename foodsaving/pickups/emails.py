from config import settings
from foodsaving.utils.email_utils import prepare_email


def prepare_pickup_notification_email(
    user,
    group,
    tonight_date,
    tomorrow_date,
    tonight_user=None,
    tonight_empty=None,
    tonight_not_full=None,
    tomorrow_user=None,
    tomorrow_empty=None,
    tomorrow_not_full=None,
):
    has_pickups_tonight = any([
        items is not None and len(items) > 0 for items in [
            tonight_user,
            tonight_empty,
            tonight_not_full,
        ]
    ])
    has_pickups_tomorrow = any([
        items is not None and len(items) > 0 for items in [
            tomorrow_user,
            tomorrow_empty,
            tomorrow_not_full,
        ]
    ])

    settings_url = '{hostname}/#/group/{group_id}/settings'.format(
        hostname=settings.HOSTNAME,
        group_id=group.id,
    )

    return prepare_email(
        template='pickup_notification',
        user=user,
        context={
            'settings_url': settings_url,
            'group': group,
            'tonight_date': tonight_date,
            'tomorrow_date': tomorrow_date,
            'has_pickups_tonight': has_pickups_tonight,
            'has_pickups_tomorrow': has_pickups_tomorrow,
            'tonight_user': tonight_user,
            'tonight_empty': tonight_empty,
            'tonight_not_full': tonight_not_full,
            'tomorrow_user': tomorrow_user,
            'tomorrow_empty': tomorrow_empty,
            'tomorrow_not_full': tomorrow_not_full,
        }
    )
