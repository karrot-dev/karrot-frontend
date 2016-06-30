from django.db.models import TextField, ManyToManyField

from yunity.base.base_models import BaseModel
from config import settings


class Group(BaseModel):
    name = TextField()
    description = TextField(null=True)
    members = ManyToManyField(settings.AUTH_USER_MODEL)
