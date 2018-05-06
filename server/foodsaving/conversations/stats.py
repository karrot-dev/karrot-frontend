from influxdb_metrics.loader import write_points


def message_written(message):
    tags = {}
    c = message.conversation
    if c.target:
        key = c.target_type.name  # e.g. group
        tags[key] = c.target_id
    write_points([{
        'measurement': 'karrot.events',
        'tags': tags,
        'fields': {'message': 1},
    }])


def reaction_given(reaction):
    tags = {}
    c = reaction.message.conversation
    if c.target:
        key = c.target_type.name  # e.g. group
        tags[key] = c.target_id
    write_points([{
        'measurement': 'karrot.events',
        'tags': tags,
        'fields': {'message_reaction': 1},
    }])
