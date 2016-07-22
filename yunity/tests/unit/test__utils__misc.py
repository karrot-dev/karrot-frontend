from yunity.utils.misc import json_stringify
from yunity.utils.tests.abc import BaseRequestTestCase


class JsonStringifyTestCase(BaseRequestTestCase):

    def test_json_stringify_creates_json_from_dict(self):
        self.given_data({'a': 1, 'b': [2, 3], 'c': {'d': 4}})
        self.when_calling(json_stringify)
        self.then_invocation_passed_with(result=b'{"a":1,"b":[2,3],"c":{"d":4}}')

    def test_json_stringify_creates_none_from_none(self):
        self.given_data(None)
        self.when_calling(json_stringify)
        self.then_invocation_passed_with(result=None)
