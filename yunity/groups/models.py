from django.db.models import Model
from django.db.models import TextField, ManyToManyField, CharField
from yunity.base.base_models import BaseModel, LocationModel
from config import settings


class Group(BaseModel, LocationModel):
    name = CharField(max_length=settings.NAME_MAX_LENGTH)
    description = TextField(blank=True)
    members = ManyToManyField(settings.AUTH_USER_MODEL, related_name='groups')
    password = CharField(max_length=255, blank=True)
