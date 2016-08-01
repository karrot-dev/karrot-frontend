from django.utils import timezone
from factory import DjangoModelFactory, SubFactory, LazyFunction
from yunity.groups.factories import Group
from yunity.stores.models import Store as StoreModel, PickupDate as PickupDateModel


class Store(DjangoModelFactory):

    class Meta:
        model = StoreModel

    group = SubFactory(Group)


class PickupDate(DjangoModelFactory):

    class Meta:
        model = PickupDateModel

    store = SubFactory(Store)
    date = LazyFunction(timezone.now)
    max_collectors = 5
