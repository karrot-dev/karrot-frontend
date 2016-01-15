from traceback import TracebackException

from django.db.transaction import atomic
from django.test import Client, TransactionTestCase
from importlib import import_module
from pkg_resources import resource_listdir
from yunity.utils.misc import json_stringify
from yunity.utils.response import content_json
from yunity.utils.tests.comparison import DeepMatcher


class IntegrationTest(object):
    _client = Client()

    def __init__(self, request, response, initial_data, final_data):
        self._request_data_resource = request
        self._response_data_resource = response
        self._initial_data_resource = initial_data
        self._final_data_resource = final_data
        self.actual_response = None
        self.actual_exception = None

    @property
    def request_data(self):
        return import_module(self._request_data_resource).request

    @property
    def response_data(self):
        return import_module(self._response_data_resource).response

    @property
    def actual_exception_cause(self):
        try:
            return content_json(self.actual_response)['reason']
        except ValueError:
            return 'not a json response'
        except KeyError:
            return 'no error reason'

    def given_data(self):
        with atomic():
            import_module(self._initial_data_resource)

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
            self.actual_exception = TracebackException.from_exception(e)

    def then_there_was_no_exception(self, testcase):
        """
        :type testcase: TestCase
        """
        if self.actual_exception is not None:
            testcase.fail('unexpected exception: {}'.format(''.join(list(self.actual_exception.format()))))

    def then_response_status_matches(self, testcase):
        """
        :type testcase: TestCase
        """
        expected_status = self.response_data['http_status']
        actual_status = self.actual_response.status_code
        if actual_status != expected_status:
            testcase.fail('http status not matching: expected: {} got {} ({})'.format(
                expected_status,
                actual_status,
                self.actual_exception_cause,
            ))

    def then_response_body_matches(self, testcase):
        """
        :type testcase: TestCase
        """

        def _get_response_json_content():
            try:
                return content_json(self.actual_response)
            except ValueError:
                testcase.fail(
                    'expected a json response, got: "{}"'.format(self.actual_response.content.decode('utf-8')))

        actual_response = _get_response_json_content()
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
            import_module(self._final_data_resource)
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


class IntegrationTestSuite(TransactionTestCase):
    serialized_rollback = True

    @classmethod
    def is_test_root(cls, resource):
        return resource.startswith('test_') and not resource.endswith('.py')

    @classmethod
    def is_resource(cls, resource):
        return resource.endswith('.py') and not resource.startswith('__init__')

    @classmethod
    def required_resources(cls):
        return {'initial_data', 'final_data', 'request', 'response'}

    @classmethod
    def list_test_resources(cls, root, test_name):
        test_root = '{}.{}'.format(root, test_name)
        test_resources = {}
        for test_resource in filter(cls.is_resource, resource_listdir(test_root, '')):
            test_resource = test_resource.split('.py')[0]
            test_resources[test_resource] = '{}.{}'.format(test_root, test_resource)
        return test_resources

    @classmethod
    def autodiscover(cls, root='yunity.resources.tests.integration'):
        for test_name in filter(cls.is_test_root, resource_listdir(root, '')):
            test_resources = cls.list_test_resources(root, test_name)
            if all(required_resource in test_resources for required_resource in cls.required_resources()):
                cls.add_test(test_name, IntegrationTest(**test_resources))

    @classmethod
    def add_test(cls, test_name, integration_test):
        setattr(cls, test_name, integration_test.as_testcase())


IntegrationTestSuite.autodiscover()
