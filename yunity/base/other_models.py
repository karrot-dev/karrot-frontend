from django.db.models import ForeignKey, TextField, FloatField, ManyToManyField
from yunity.base.models import BaseModel, HubbedMixin, MaxLengthCharField, Hub


class Item(BaseModel):
    user = ForeignKey('users.User')
    description = TextField()
    latitude = FloatField(blank=True, null=True)
    longitude = FloatField(blank=True, null=True)


class Group(BaseModel, HubbedMixin):
    name = MaxLengthCharField()
    description = TextField(null=True)


class Store(BaseModel, HubbedMixin):
    name = MaxLengthCharField(null=True)


class Permission(BaseModel):
    name = MaxLengthCharField(null=True)


class Team(BaseModel, HubbedMixin):
    name = MaxLengthCharField(null=True)
    permissions = ManyToManyField(Permission)
    team_hub = ForeignKey(Hub)

    HubbedMixin.configure(wall=True)
