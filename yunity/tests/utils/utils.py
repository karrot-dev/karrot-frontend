from json import dumps as dump_json
from json import loads as load_json

from pkg_resources import resource_string
from django.test import RequestFactory


class JsonRequestFactory(RequestFactory):
    def post(self, path, data=None, secure=False, **kwargs):
        return super().post(path, data=json_stringify(data), content_type="application/json", secure=secure, **kwargs)


class DeepMatcher(object):
    ANY_INT = 'AnyInt'

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
    return dump_json(data).encode("utf-8") if data else None


def content_json(response):
    return load_json(response.content.decode("utf-8"))


def load_json_resource(resource, filename):
    return load_json(resource_string(resource, filename).decode('utf8'))


def is_test_resource(resource):
    return resource.startswith('test_')
