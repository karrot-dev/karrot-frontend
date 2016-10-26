from django.db.models import TextField, ManyToManyField, CharField
from yunity.base.base_models import BaseModel, LocationModel
from config import settings

MAX_NAME_LENGTH = 80


class Group(BaseModel, LocationModel):
    name = CharField(max_length=MAX_NAME_LENGTH)
    description = TextField(null=True)
    members = ManyToManyField(settings.AUTH_USER_MODEL, related_name='groups')
