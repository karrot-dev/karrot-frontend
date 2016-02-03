from itertools import chain

from django.db.models import TextField, ForeignKey, CASCADE, BooleanField

from yunity.base.hub_models import HubMixin
from yunity.base.hub_models import InitialHubOptions
from yunity.base.base_models import BaseModel


class Group(BaseModel, HubMixin):

    DEFAULT_HUB_OPTIONS = InitialHubOptions(has_wall=True)

    @classmethod
    def all_children_of(cls, *groups):
        return list(chain.from_iterable([c.all_children() for c in groups]))

    def parents(self):
        return [self.parent] + self.parent.parents() if self.parent else []

    def root(self):
        return self.parent.root() if self.parent else self

    def all_children(self):
        return self.__class__.all_children_of(*self.children)

    name = TextField()
    description = TextField(null=True)
    parent = ForeignKey('groups.Group', null=True, on_delete=CASCADE, related_name='children')

    is_content_included_in_parent = BooleanField(default=False)