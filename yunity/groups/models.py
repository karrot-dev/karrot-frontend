from django.contrib.auth import get_user_model
from django.db.models import TextField, ManyToManyField
from yunity.base.base_models import BaseModel


class Group(BaseModel):
    name = TextField()
    description = TextField(null=True)
    members = ManyToManyField(get_user_model())
