from influxdb_metrics.loader import write_points


def email_sent(recipient_count):
    write_points([{
        'measurement': 'karrot.email.sent',
        'fields': {'value': 1, 'recipient_count': recipient_count},
    }])


def email_error(recipient_count):
    write_points([{
        'measurement': 'karrot.email.error',
        'fields': {'value': 1, 'recipient_count': recipient_count},
    }])
