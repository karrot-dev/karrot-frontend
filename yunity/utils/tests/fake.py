from faker import Faker as BaseFaker
from faker.providers import BaseProvider


class FakeLocationProvider(BaseProvider):
    faker = BaseFaker()

    @classmethod
    def location(cls):
        return {
            'description': cls.faker.address(),
            'latitude': float(cls.faker.latitude()),
            'longitude': float(cls.faker.longitude()),
        }


class Faker(object):
    def __init__(self, seed=123):
        self._faker = BaseFaker()
        self._faker.seed(seed)
        self._faker.add_provider(FakeLocationProvider)

    def __getattr__(self, item):
        return getattr(self._faker, item)


faker = Faker()
