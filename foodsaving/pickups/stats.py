from influxdb_metrics.loader import write_points


def pickup_tags(pickup):
    return {
        'group': str(pickup.store.group.id),
        'store': str(pickup.store.id),
    }


def pickup_joined(pickup):
    write_points([{
        'measurement': 'karrot.pickup.joined',
        'tags': pickup_tags(pickup),
        'fields': {'value': 1},
    }])


def pickup_left(pickup):
    write_points([{
        'measurement': 'karrot.pickup.left',
        'tags': pickup_tags(pickup),
        'fields': {'value': 1},
    }])


def pickup_done(pickup):
    write_points([{
        'measurement': 'karrot.pickup.done',
        'tags': pickup_tags(pickup),
        'fields': {'value': 1},
    }])


def pickup_missed(pickup):
    write_points([{
        'measurement': 'karrot.pickup.missed',
        'tags': pickup_tags(pickup),
        'fields': {'value': 1},
    }])


def feedback_given(feedback):
    write_points([{
        'measurement': 'karrot.feedback',
        'tags': pickup_tags(feedback.about),
        'fields': {'value': 1},
    }])
