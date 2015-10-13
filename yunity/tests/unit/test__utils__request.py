from yunity.utils.request import JsonRequest
from yunity.utils.tests.abc import BaseTestCase, AnyResult


class JsonRequestTestCase(BaseTestCase):
    def test_from_http_request_creates_json_request(self):
        self.given_json_request(body={'foo': 1})
        self.when_calling(JsonRequest.from_http_request)
        self.then_invocation_passed_with(AnyResult())

    def test_from_http_request_rejects_non_json_data(self):
        self.given_raw_request(body={'foo': 1})
        self.when_calling(JsonRequest.from_http_request)
        self.then_invocation_failed_with(ValueError)

    def given_raw_request(self, body):
        http_request = self.request_factory.post(path='/dummy/path', data=body)
        self.given_data(http_request=http_request)

    def given_json_request(self, body):
        http_request = self.json_request_factory.post(path='/dummy/path', data=body)
        self.given_data(http_request=http_request)
