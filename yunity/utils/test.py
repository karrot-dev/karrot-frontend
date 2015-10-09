from importlib import import_module
from json import dumps as dump_json
from json import loads as load_json
from unittest import TestCase

from django.utils.datetime_safe import datetime


class DeepMatcher(object):
    ANY_INT = 'AnyInt'
    ANY_STRING = 'AnyString'
    DATETIME_AROUND_NOW = 'DatetimeAroundNow'

    @classmethod
    def _fuzzy_match_dicts(cls, actual, expected):
        for key, expected_value in expected.items():
            actual_value = actual.get(key)
            cls.fuzzy_match(actual_value, expected_value)

    @classmethod
    def _fuzzy_match_lists(cls, actual, expected):
        for expected_item, actual_item in zip(expected, actual):
            cls.fuzzy_match(actual_item, expected_item)

    @classmethod
    def _fuzzy_match_leaves(cls, actual, expected):
        if expected == cls.ANY_INT:
            if not isinstance(actual, int):
                raise ValueError('expected any integer, got {}'.format(actual))
        elif expected == cls.ANY_STRING:
            if not isinstance(actual, str):
                raise ValueError('expected any string, got {}'.format(actual))
        elif expected == cls.DATETIME_AROUND_NOW:
            actual_time = datetime.strptime(actual, "%Y-%m-%dT%H:%M:%S")
            now = datetime.utcnow()
            difference = now - actual_time
            if abs(difference.total_seconds()) > 60:
                raise ValueError('expected an UTC time string within 60 seconds of now, got {}'.format(actual))
        else:
            if actual != expected:
                raise ValueError('expected {}, got {}'.format(expected, actual))

    @classmethod
    def fuzzy_match(cls, actual, expected):
        """
        :raises ValueError: if the arguments do not match
        """
        if isinstance(expected, dict) and isinstance(actual, dict):
            cls._fuzzy_match_dicts(actual, expected)
        elif isinstance(expected, list) and isinstance(actual, list):
            cls._fuzzy_match_lists(actual, expected)
        else:
            cls._fuzzy_match_leaves(actual, expected)


def json_stringify(data):
    return dump_json(data, sort_keys=True, separators=(',', ':')).encode("utf-8") if data else None


def content_json(response):
    return load_json(response.content.decode("utf-8"))


def is_test_resource(resource):
    return resource.startswith('test_')


def maybe_import(resource):
    try:
        import_module(resource)
    except ImportError:
        pass


class BaseTestCase(TestCase):
    def setUp(self):
        self.args = []
        self.kwargs = {}
        self.result = None
        self.exception = None

    def given_data(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs

    def when_calling(self, function):
        try:
            self.result = function(*self.args, **self.kwargs)
        except Exception as e:
            self.exception = e

    def _then_there_was_no_exception(self):
        self.assertIsNone(self.exception, 'got an unexpected exception')

    def then_invocation_failed_with(self, exception):
        self.assertIsInstance(self.exception, exception)

    def then_invocation_passed_with_no_result(self):
        self._then_there_was_no_exception()
        self.assertIsNone(self.result, 'got an unexpected result')

    def then_invocation_passed_with_any_result(self):
        self._then_there_was_no_exception()
        self.assertIsNotNone(self.result, 'did not get a result')

    def then_invocation_passed_with(self, result):
        self._then_there_was_no_exception()
        self.assertEqual(self.result, result, 'results do not match')
