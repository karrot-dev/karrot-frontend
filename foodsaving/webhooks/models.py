from django.contrib.postgres.fields import JSONField
from django.db.models import CharField, TextField, BigAutoField

from foodsaving.base.base_models import BaseModel


class EmailEvent(BaseModel):
    id = BigAutoField(primary_key=True)
    address = TextField()
    event = CharField(max_length=255)
    payload = JSONField()
