from itertools import chain

from django.db.models import TextField, ForeignKey, CASCADE, BooleanField

from yunity.base.hub_models import HubMixin
from yunity.base.hub_models import InitialHubOptions
from yunity.base.base_models import BaseModel


class Group(BaseModel, HubMixin):

    DEFAULT_HUB_OPTIONS = InitialHubOptions(has_wall=True)

    name = TextField()
    description = TextField(null=True)
