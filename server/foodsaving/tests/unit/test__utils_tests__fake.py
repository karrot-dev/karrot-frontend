from django.test import TestCase
from foodsaving.utils.tests.fake import Faker


class FakerTestCase(TestCase):

    def test_faker_is_deterministic(self):
        self.given_new_faker()
        self.when_creating_fake_data()
        self.given_new_faker()
        self.when_creating_fake_data()
        self.then_fake_data_matches()

    def setUp(self):
        super().setUp()
        self.faker = None
        self.fake_data = []

    def given_new_faker(self):
        del self.faker
        self.faker = Faker()

    def when_creating_fake_data(self, with_method='name', num_data=10):
        fake_data = [getattr(self.faker, with_method)() for _ in range(num_data)]
        self.fake_data.append(fake_data)

    def then_fake_data_matches(self):
        for fake_data in self.fake_data:
            self.assertEqual(fake_data, self.fake_data[0])
