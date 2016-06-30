from django.db.models import TextField, ManyToManyField

from yunity.base.base_models import BaseModel
from yunity.users.models import User as UserModel


class Group(BaseModel):
    name = TextField()
    description = TextField(null=True)
    members = ManyToManyField(UserModel)
