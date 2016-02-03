from django.db.models import ForeignKey, TextField, FloatField

from yunity.base.base_models import BaseModel, MaxLengthCharField
from yunity.base.hub_models import HubMixin, Hub


class Item(BaseModel):
    user = ForeignKey('users.User')
    description = TextField()
    latitude = FloatField(blank=True, null=True)
    longitude = FloatField(blank=True, null=True)


class Store(BaseModel, HubMixin):
    name = MaxLengthCharField(null=True)


class Team(BaseModel, HubMixin):
    name = MaxLengthCharField(null=True)
    team_hub = ForeignKey(Hub)


class TeamAction(BaseModel):
    team = ForeignKey(Team, related_name='actions')
    module = TextField()
    action = TextField()