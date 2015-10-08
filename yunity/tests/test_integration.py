from importlib import import_module

from django.core.urlresolvers import resolve
from pkg_resources import resource_listdir
from django.test import TestCase

from yunity.utils.test import JsonRequestFactory, is_test_resource, content_json, DeepMatcher, maybe_import


class IntegrationTest(object):
    _request_factory = JsonRequestFactory()

    def __init__(self, resource):
        self._database_setup = lambda: maybe_import('{}.initial_data'.format(resource))
        self._database_checks = lambda: maybe_import('{}.final_data'.format(resource))
        self._request = self._load_request(resource)
        self._response = self._load_response(resource)
        self.request = None
        self.response = None

    @classmethod
    def _load_response(cls, resource):
        try:
            return import_module('{}.response'.format(resource)).response
        except Exception:
            raise ValueError('must specify response.py for test')

    @classmethod
    def _load_request(cls, resource):
        try:
            return import_module('{}.request'.format(resource)).request
        except Exception:
            raise ValueError('must specify request in request.py for test')

    def _post(self):
        endpoint = self._request['endpoint']
        body = self._request['body']
        return self._request_factory.post(endpoint, body)

    def given_database(self):
        self._database_setup()

    def given_request(self):
        http_method = self._request['method'].upper()

        if http_method == 'POST':
            self.request = self._post()
        else:
            raise NotImplementedError('unknown http method: {}'.format(http_method))

    def given_user(self):
        try:
            self.request.user = self._request['user']
        except KeyError:
            pass

    def when_calling_endpoint(self):
        endpoint = self._request['endpoint']
        api = getattr(resolve(endpoint).func.view_class(), self._request['method'])
        self.response = api(self.request)

    def then_response_status_matches(self, testcase):
        actual_status = self.response.status_code
        expected_status = self._response['http_status']
        testcase.assertEqual(actual_status, expected_status, 'http status not matching: "{}"'.format(content_json(self.response).get('reason', '(no error reason)')))

    def then_response_body_matches(self, testcase):
        actual_response = content_json(self.response)
        expected_response = self._response.get('response', {})
        try:
            DeepMatcher.fuzzy_match(actual_response, expected_response)
        except ValueError as e:
            testcase.fail(e.args[0])

    def then_database_is_updated(self, testcase):
        try:
            self._database_checks()
        except AssertionError as e:
            testcase.fail(e.args[0])

    def as_testcase(self):
        def test(testcase):
            """
            :type testcase: TestCase
            """
            self.given_database()
            self.given_request()
            self.given_user()

            self.when_calling_endpoint()

            self.then_response_status_matches(testcase)
            self.then_response_body_matches(testcase)
            self.then_database_is_updated(testcase)

        return test


class IntegrationTestSuite(TestCase):
    @classmethod
    def autodiscover(cls, root='yunity.resources.tests.integration'):
        for test_name in filter(is_test_resource, resource_listdir(root, '')):
            test_resource = '{}.{}'.format(root, test_name)
            cls.add_test(test_name, IntegrationTest(test_resource))

    @classmethod
    def add_test(cls, test_name, integration_test):
        setattr(cls, test_name, integration_test.as_testcase())


IntegrationTestSuite.autodiscover()
