from importlib import import_module

from pkg_resources import resource_listdir
from django.test import TestCase, Client

from yunity.utils.test import is_test_resource, content_json, DeepMatcher, maybe_import, json_stringify


class IntegrationTest(object):
    _client = Client()

    def __init__(self, resource):
        self._resource_root = resource
        self.actual_response = None
        self.actual_exception = None

    def _resource(self, name):
        _cache = '__cache__{}'.format(name)
        try:
            return getattr(self, _cache)
        except AttributeError:
            try:
                value = getattr(import_module('{}.{}'.format(self._resource_root, name)), name)
            except Exception:
                raise ValueError('must specify {}.py for test'.format(name))
            setattr(self, _cache, value)
            return value

    @property
    def request_data(self):
        return self._resource('request')

    @property
    def response_data(self):
        return self._resource('response')

    def given_user(self):
        request_user = self.request_data.get('user')
        if request_user:
            self._client.force_login(request_user)

    def when_calling_endpoint(self):
        method = self.request_data['method'].lower()
        path = self.request_data['endpoint']
        data = self.request_data.get('body')
        api = getattr(self._client, method)
        try:
            self.actual_response = api(
                path=path,
                data=json_stringify(data),
                content_type='application/json',
            )
        except Exception as e:
            self.actual_exception = e

    def then_there_was_no_exception(self, testcase):
        """
        :type testcase: TestCase
        """
        testcase.assertIsNone(self.actual_exception, 'unexpected exception: {}'.format(self.actual_exception))

    def then_response_status_matches(self, testcase):
        """
        :type testcase: TestCase
        """
        expected_status = self.response_data['http_status']
        actual_status = self.actual_response.status_code
        testcase.assertEqual(actual_status, expected_status, 'http status not matching: "{}"'.format(content_json(self.actual_response).get('reason', '(no error reason)')))

    def then_response_body_matches(self, testcase):
        """
        :type testcase: TestCase
        """
        actual_response = content_json(self.actual_response)
        expected_response = self.response_data.get('response', {})
        try:
            DeepMatcher.fuzzy_match(actual_response, expected_response)
        except ValueError as e:
            testcase.fail(e.args[0])

    def then_database_is_updated(self, testcase):
        """
        :type testcase: TestCase
        """
        try:
            maybe_import('{}.final_data'.format(self._resource_root))
        except AssertionError as e:
            testcase.fail(e.args[0])

    def as_testcase(self):
        def test(testcase):
            """
            :type testcase: TestCase
            """
            self.given_user()

            self.when_calling_endpoint()

            self.then_there_was_no_exception(testcase)
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
