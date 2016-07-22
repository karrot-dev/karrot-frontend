from yunity.utils.misc import json_stringify
from django.test import TestCase


class JsonStringifyTestCase(TestCase):

    def test_json_stringify_creates_json_from_dict(self):
        result = json_stringify({'a': 1, 'b': [2, 3], 'c': {'d': 4}})
        self.assertEqual(result, b'{"a":1,"b":[2,3],"c":{"d":4}}')

    def test_json_stringify_creates_none_from_none(self):
        result = json_stringify(None)
        self.assertEqual(result, None)
