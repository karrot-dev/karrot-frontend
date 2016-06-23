from factory import DjangoModelFactory, SubFactory
from yunity.groups.factories import Group
from yunity.stores.models import Store as StoreModel


class Store(DjangoModelFactory):
    class Meta:
        model = StoreModel

    group = SubFactory(Group)
