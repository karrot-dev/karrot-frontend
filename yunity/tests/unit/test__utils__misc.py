from sys import modules

from django.http import HttpResponse

from yunity.utils.tests.abc import BaseTestCase
from yunity.utils.misc import json_stringify, content_json, maybe_import


class ContentJsonTestCase(BaseTestCase):
    def test_content_json_returns_content(self):
        self.given_json_response(content={"foo": 1})
        self.when_calling(content_json)
        self.then_invocation_passed_with(result={"foo": 1})

    def test_content_json_fails_when_response_content_is_not_valid_json(self):
        self.given_raw_response(content='not a json response')
        self.when_calling(content_json)
        self.then_invocation_failed_with(ValueError)

    def given_json_response(self, content):
        self.given_raw_response(json_stringify(content))

    def given_raw_response(self, content):
        self.given_data(response=HttpResponse(content=content))


class JsonStringifyTestCase(BaseTestCase):
    def test_json_stringify_creates_json_from_dict(self):
        self.given_data({'a': 1, 'b': [2, 3], 'c': {'d': 4}})
        self.when_calling(json_stringify)
        self.then_invocation_passed_with(result=b'{"a":1,"b":[2,3],"c":{"d":4}}')

    def test_json_stringify_creates_none_from_none(self):
        self.given_data(None)
        self.when_calling(json_stringify)
        self.then_invocation_passed_with(result=None)


class MaybeImportTestCase(BaseTestCase):
    def test_maybe_import_imports_existing_module(self):
        self.given_data(__name__)
        self.when_calling(maybe_import)
        self.then_invocation_passed_with(result=modules[__name__])

    def test_maybe_import_does_not_import_missing_module(self):
        self.given_data('a.module.that.does.not.exist')
        self.when_calling(maybe_import)
        self.then_invocation_passed_with(result=None)
