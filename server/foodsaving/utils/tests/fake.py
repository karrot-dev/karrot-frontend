from faker import Faker as BaseFaker


class Faker(object):

    def __init__(self, seed=123):
        self._faker = BaseFaker()
        self._faker.seed(seed)

    def __getattr__(self, item):
        return getattr(self._faker, item)


faker = Faker()
