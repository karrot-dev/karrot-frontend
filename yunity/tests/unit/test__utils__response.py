from django.http import HttpResponse

from yunity.utils.misc import json_stringify
from yunity.utils.response import content_json
from yunity.utils.tests.abc import BaseTestCase


class ContentJsonTestCase(BaseTestCase):
    def test_content_json_returns_content(self):
        self.given_json_response(content={"foo": 1})
        self.when_calling(content_json)
        self.then_invocation_passed_with(result={"foo": 1})

    def test_content_json_returns_empty_for_empty_content(self):
        self.given_raw_response(content="")
        self.when_calling(content_json)
        self.then_invocation_passed_with(result={})

    def test_content_json_fails_when_response_content_is_not_valid_json(self):
        self.given_raw_response(content='not a json response')
        self.when_calling(content_json)
        self.then_invocation_failed_with(ValueError)

    def given_json_response(self, content):
        self.given_raw_response(json_stringify(content))

    def given_raw_response(self, content):
        self.given_data(response=HttpResponse(content=content))
