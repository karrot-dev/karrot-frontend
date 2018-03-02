from influxdb_metrics.loader import write_points


def message_written(message):
    tags = {}
    c = message.conversation
    if c.target:
        key = c.target_type.name  # e.g. group
        tags[key] = c.target_id
    write_points([{
        'measurement': 'karrot.conversation.message',
        'tags': tags,
        'fields': {'value': 1},
    }])
