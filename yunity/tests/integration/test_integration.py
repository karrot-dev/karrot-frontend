from importlib import import_module

from django.core.urlresolvers import resolve
from pkg_resources import resource_listdir
from django.test import TestCase

from yunity.tests.utils import JsonRequestFactory, load_json_resource, is_test_resource, content_json, DeepMatcher


class IntegrationTest(object):
    _request_factory = JsonRequestFactory()

    def __init__(self, resource):
        self._initial_data = '{}.initial_data'.format(resource)
        self._request = load_json_resource(resource, 'request.json')
        self._response = load_json_resource(resource, 'response.json')
        self.database = None
        self.request = None
        self.response = None

    def _post(self):
        endpoint = self._request['endpoint']
        body = self._request['body']
        return self._request_factory.post(endpoint, body)

    def given_database(self):
        self.database = self.database or import_module(self._initial_data)

    def given_request(self):
        http_method = self._request['method'].upper()

        if http_method == 'POST':
            self.request = self._post()
        else:
            raise NotImplementedError('unknown http method: {}'.format(http_method))

        self.request.user = self.database.request_user

    def when_calling_endpoint(self):
        endpoint = self._request['endpoint']
        api = getattr(resolve(endpoint).func.view_class(), self._request['method'])
        self.response = api(self.request)

    def then_response_status_matches(self, testcase):
        actual_status = self.response.status_code
        expected_status = self._response['http_status']
        testcase.assertEqual(actual_status, expected_status, 'http status not matching')

    def then_response_body_matches(self, testcase):
        actual_response = content_json(self.response)
        expected_response = self._response.get('response', {})
        try:
            DeepMatcher.fuzzy_match(actual_response, expected_response)
        except ValueError as e:
            testcase.fail(str(e))

    def as_testcase(self):
        def test(testcase):
            """
            :type testcase: TestCase
            """
            self.given_database()
            self.given_request()
            self.when_calling_endpoint()
            self.then_response_status_matches(testcase)
            self.then_response_body_matches(testcase)

        return test


class IntegrationTestSuite(TestCase):
    @classmethod
    def autodiscover(cls, root='yunity.tests.integration.resources'):
        for test_name in filter(is_test_resource, resource_listdir(root, '')):
            test_resource = '{}.{}'.format(root, test_name)
            cls.add_test(test_name, IntegrationTest(test_resource))

    @classmethod
    def add_test(cls, test_name, integration_test):
        setattr(cls, test_name, integration_test.as_testcase())


IntegrationTestSuite.autodiscover()
