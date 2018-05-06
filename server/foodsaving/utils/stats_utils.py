from influxdb_metrics.loader import write_points


def periodic_task(name, extra_fields=None):
    if extra_fields is None:
        extra_fields = {}
    write_points([{
        'measurement': 'karrot.periodic',
        'tags': {'name': name, },
        'fields': {'value': 1, **extra_fields},
    }])
