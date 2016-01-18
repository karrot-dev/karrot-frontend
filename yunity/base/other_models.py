from itertools import chain

from django.db.models import ForeignKey, TextField, FloatField, ManyToManyField, BooleanField, CASCADE

from yunity.base.hub_models import Hub, HubMixin
from yunity.base.models import BaseModel, MaxLengthCharField


class Item(BaseModel):
    user = ForeignKey('users.User')
    description = TextField()
    latitude = FloatField(blank=True, null=True)
    longitude = FloatField(blank=True, null=True)


class Group(BaseModel, HubMixin):
    @classmethod
    def all_children_of(cls, *groups):
        return list(chain.from_iterable([c.all_children() for c in groups]))

    def parents(self):
        return [self.parent] + self.parent.parents() if self.parent else []

    def root(self):
        return self.parent.root() if self.parent else self

    def all_children(self):
        return self.__class__.all_children_of(*self.children)

    name = MaxLengthCharField()
    description = TextField(null=True)
    parent = ForeignKey('base.Group', null=True, on_delete=CASCADE, related_name='children')

    is_content_included_in_parent = BooleanField(default=False)


class Store(BaseModel, HubMixin):
    name = MaxLengthCharField(null=True)


class Permission(BaseModel):
    name = MaxLengthCharField(null=True)


class Team(BaseModel, HubMixin):
    name = MaxLengthCharField(null=True)
    permissions = ManyToManyField(Permission)
    team_hub = ForeignKey(Hub)