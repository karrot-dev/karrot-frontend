from factory import DjangoModelFactory, SubFactory, LazyFunction
from faker.utils.datetime_safe import datetime
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
    date = LazyFunction(datetime.utcnow)
    max_collectors = None

