from yunity.utils.request import JsonRequest, Parameter
from yunity.utils.tests.abc import BaseTestCase, AnyResult
from yunity.utils.validation import OfType, HasKey


class JsonRequestTestCase(BaseTestCase):
    def test_from_http_request_creates_json_request(self):
        self.given_json_request(body={'foo': 1})
        self.when_calling(JsonRequest.from_http_request)
        self.then_invocation_passed_with(AnyResult())

    def test_from_http_request_rejects_non_json_data(self):
        self.given_raw_request(body={'foo': 1})
        self.when_calling(JsonRequest.from_http_request)
        self.then_invocation_failed_with(ValueError)

    def test_from_http_request_ensures_parameters_exist(self):
        self.given_json_request(body={'foo': 1})
        self.given_parameter('foo')
        self.when_calling(JsonRequest.from_http_request)
        self.then_invocation_passed_with(AnyResult())

    def test_from_http_request_fails_when_parameter_does_not_exist(self):
        self.given_json_request(body={'bar': 1})
        self.given_parameter('foo')
        self.when_calling(JsonRequest.from_http_request)
        self.then_invocation_failed_with(ValueError)

    def test_from_http_request_validates_parameters(self):
        self.given_json_request(body={'foo': 1})
        self.given_parameter('foo', HasKey('foo') & OfType(int))
        self.when_calling(JsonRequest.from_http_request)
        self.then_invocation_passed_with(AnyResult())

    def test_from_http_request_fails_if_parameters_do_not_validate(self):
        self.given_json_request(body={'foo': '1'})
        self.given_parameter('foo', HasKey('foo') & OfType(int))
        self.when_calling(JsonRequest.from_http_request)
        self.then_invocation_failed_with(ValueError)

    def given_raw_request(self, body):
        http_request = self.request_factory.post(path='/dummy/path', data=body)
        self.given_data(http_request=http_request)

    def given_json_request(self, body):
        http_request = self.json_request_factory.post(path='/dummy/path', data=body)
        self.given_data(http_request=http_request)

    def given_parameter(self, name, validation=None):
        self.given_data(parameters=[Parameter(name, validation)])
