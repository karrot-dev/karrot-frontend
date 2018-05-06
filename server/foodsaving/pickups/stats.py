from influxdb_metrics.loader import write_points


def pickup_tags(pickup):
    return {
        'group': str(pickup.store.group.id),
        'store': str(pickup.store.id),
    }


def pickup_joined(pickup):
    write_points([{
        'measurement': 'karrot.events',
        'tags': pickup_tags(pickup),
        'fields': {'pickup_joined': 1},
    }])


def pickup_left(pickup):
    write_points([{
        'measurement': 'karrot.events',
        'tags': pickup_tags(pickup),
        'fields': {'pickup_left': 1},
    }])


def pickup_done(pickup):
    write_points([{
        'measurement': 'karrot.events',
        'tags': pickup_tags(pickup),
        'fields': {'pickup_done': 1},
    }])


def pickup_missed(pickup):
    write_points([{
        'measurement': 'karrot.events',
        'tags': pickup_tags(pickup),
        'fields': {'pickup_missed': 1},
    }])


def feedback_given(feedback):
    write_points([{
        'measurement': 'karrot.events',
        'tags': pickup_tags(feedback.about),
        'fields': {'feedback': 1},
    }])


def pickup_notification_email(group, **kwargs):
    write_points([{
        'measurement': 'karrot.email.pickup_notification',
        'tags': {
            'group': str(group.id)
        },
        'fields': {'value': 1, **kwargs},
    }])
