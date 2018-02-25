from django.contrib.postgres.fields import JSONField
from django.db.models import CharField, TextField

from foodsaving.base.base_models import BaseModel


class EmailEvent(BaseModel):
    address = TextField()
    event = CharField(max_length=255)
    payload = JSONField()
