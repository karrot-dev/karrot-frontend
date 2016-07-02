from yunity.utils.tests.abc import BaseRequestTestCase
from yunity.utils.tests.fake import faker as default_faker, Faker
from yunity.utils.validation import Validator, OfType, HasKey, IsReasonableLengthString


class ValidLocation(Validator):

    def __call__(self, location):
        (HasKey('description') & IsReasonableLengthString())(location)
        (HasKey('latitude') & OfType(float))(location)
        (HasKey('longitude') & OfType(float))(location)


class FakerTestCase(BaseRequestTestCase):

    def test_faker_creates_fake_locations(self):
        self.given_data()
        self.when_calling(default_faker.location)
        self.then_invocation_passed_with(ValidLocation())

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
