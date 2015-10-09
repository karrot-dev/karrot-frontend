from django.db.models import Model


def model_to_json(model, *fields):
    serialized = dict()
    for field in fields:
        value = getattr(model, field)
        if not value:
            continue
        if isinstance(value, Model):
            value = value.id
        serialized[field] = value
    return serialized
