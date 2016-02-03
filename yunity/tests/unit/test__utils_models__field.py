from yunity.base.base_models import MaxLengthCharField
from yunity.utils.tests.abc import BaseRequestTestCase


class MaxLengthCharFieldTestCase(BaseRequestTestCase):
    def test_max_length_char_field_always_has_max_length(self):
        self.assertEqual(MaxLengthCharField().max_length, 255)
