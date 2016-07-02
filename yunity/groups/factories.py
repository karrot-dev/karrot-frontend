from factory import DjangoModelFactory
from yunity.groups.models import Group as GroupModel


class Group(DjangoModelFactory):

    class Meta:
        model = GroupModel
