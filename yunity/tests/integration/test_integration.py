from importlib import import_module
from django.db.transaction import atomic

from pkg_resources import resource_listdir
from django.test import TestCase, Client

from yunity.utils.tests.misc import content_json, maybe_import, json_stringify
from yunity.utils.tests.comparison import DeepMatcher


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

    @property
    def actual_exception_cause(self):
        try:
            return content_json(self.actual_response)['reason']
        except ValueError:
            return '(not a json response)'
        except KeyError:
            return '(no error reason)'

    def given_data(self):
        with atomic():
            import_module('{}.initial_data'.format(self._resource_root))

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
        if self.actual_exception is not None:
            testcase.fail('unexpected exception: {}'.format(self.actual_exception.args[0]))

    def then_response_status_matches(self, testcase):
        """
        :type testcase: TestCase
        """
        expected_status = self.response_data['http_status']
        actual_status = self.actual_response.status_code
        if actual_status != expected_status:

            testcase.fail('http status not matching: {}'.format(self.actual_exception_cause))

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
            self.given_data()
            self.given_user()

            self.when_calling_endpoint()

            self.then_there_was_no_exception(testcase)
            self.then_response_status_matches(testcase)
            self.then_response_body_matches(testcase)
            self.then_database_is_updated(testcase)

        return test


class IntegrationTestSuite(TestCase):
    @classmethod
    def is_integration_test(cls, resource):
        """
        :type resource: str
        :rtype: bool
        """
        return resource.startswith('test_')

    @classmethod
    def autodiscover(cls, root='yunity.resources.tests.integration'):
        for test_name in filter(cls.is_integration_test, resource_listdir(root, '')):
            test_resource = '{}.{}'.format(root, test_name)
            cls.add_test(test_name, IntegrationTest(test_resource))

    @classmethod
    def add_test(cls, test_name, integration_test):
        setattr(cls, test_name, integration_test.as_testcase())


IntegrationTestSuite.autodiscover()
