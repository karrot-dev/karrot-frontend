from django.db.models import ForeignKey, TextField, FloatField, ManyToManyField, BooleanField, CASCADE

from yunity.base.hub_models import Hub, HubMixin
from yunity.base.models import BaseModel, MaxLengthCharField


class Item(BaseModel):
    user = ForeignKey('users.User')
    description = TextField()
    latitude = FloatField(blank=True, null=True)
    longitude = FloatField(blank=True, null=True)


class Group(BaseModel, HubMixin):
    name = MaxLengthCharField()
    description = TextField(null=True)



class Store(BaseModel, HubMixin):
    name = MaxLengthCharField(null=True)


class Permission(BaseModel):
    name = MaxLengthCharField(null=True)


class Team(BaseModel, HubMixin):
    name = MaxLengthCharField(null=True)
    permissions = ManyToManyField(Permission)
    team_hub = ForeignKey(Hub)