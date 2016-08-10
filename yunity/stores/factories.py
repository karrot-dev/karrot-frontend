from django.utils import timezone
from factory import DjangoModelFactory, SubFactory, LazyFunction
from factory import LazyAttribute

from yunity.groups.factories import Group
from yunity.stores.models import Store as StoreModel, PickupDate as PickupDateModel
from yunity.utils.tests.fake import faker


class Store(DjangoModelFactory):

    class Meta:
        model = StoreModel

    group = SubFactory(Group)
    name = LazyAttribute(lambda x: faker.sentence(nb_words=4))
    description = LazyAttribute(lambda x: faker.name())


class PickupDate(DjangoModelFactory):

    class Meta:
        model = PickupDateModel

    store = SubFactory(Store)
    date = LazyFunction(timezone.now)
    max_collectors = 5
