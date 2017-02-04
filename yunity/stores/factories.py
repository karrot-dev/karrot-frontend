from datetime import timedelta

from django.utils import timezone
from factory import DjangoModelFactory, SubFactory, LazyFunction
from factory import LazyAttribute

from yunity.groups.factories import Group
from yunity.stores.models import Store as StoreModel, PickupDate as PickupDateModel, \
    PickupDateSeries as PickupDateSeriesModel
from yunity.utils.tests.fake import faker


class Store(DjangoModelFactory):

    class Meta:
        model = StoreModel

    group = SubFactory(Group)
    name = LazyAttribute(lambda x: faker.sentence(nb_words=4))
    description = LazyAttribute(lambda x: faker.name())


def in_one_day():
    return timezone.now() + timedelta(days=1)


class PickupDate(DjangoModelFactory):

    class Meta:
        model = PickupDateModel

    store = SubFactory(Store)
    date = LazyFunction(in_one_day)
    max_collectors = 5


class PickupDateSeries(DjangoModelFactory):

    class Meta:
        model = PickupDateSeriesModel

    store = SubFactory(Store)
    start_date = LazyAttribute(lambda _: timezone.now())
    rule = 'FREQ=WEEKLY'
