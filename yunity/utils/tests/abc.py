from unittest import TestCase as UnittestTestCase

from django.test import TestCase as DjangoTestCase

from django.test import RequestFactory

from yunity.utils.request import JsonRequestFactory
from yunity.utils.validation import Validator


class AnyResult(Validator):

    def __call__(self, value):
        if value is None:
            raise ValueError('expected any value, got nothing')
        return value


class NoResult(Validator):

    def __call__(self, value):
        if value is not None:
            raise ValueError('expected no value, got {}'.format(value))
        return value


class BaseTestCase(DjangoTestCase):

    def assertIncludes(self, collection, item):
        if item not in collection:
            self.fail('item {} was not in collection {}'.format(item, collection))


class BaseRequestTestCase(UnittestTestCase):
    json_request_factory = JsonRequestFactory()
    request_factory = RequestFactory()

    def setUp(self):
        self.args = []
        self.kwargs = {}
        self.result = None
        self.exception = None

    def _update_args(self, args):
        self.args.extend(args)

    def _update_kwargs(self, kwargs):
        for parameter, new_value in kwargs.items():
            try:
                existing_value = self.kwargs[parameter]
            except KeyError:
                self.kwargs[parameter] = new_value
            else:
                self._consolidate_kwargs(parameter, new_value, existing_value)

    def _consolidate_kwargs(self, parameter, new_value, existing_value):
        if isinstance(existing_value, list) and isinstance(new_value, list):
            self.kwargs[parameter].extend(new_value)
        elif isinstance(existing_value, dict) and isinstance(new_value, dict):
            self.kwargs[parameter].update(new_value)
        elif new_value != existing_value:
            raise ValueError('duplicate values provided for argument {}'.format(parameter))

    def given_data(self, *args, **kwargs):
        self._update_args(args)
        self._update_kwargs(kwargs)

    def when_calling(self, function):
        try:
            self.result = function(*self.args, **self.kwargs)
        except Exception as e:
            self.exception = e

    def _then_there_was_no_exception(self):
        self.assertIsNone(self.exception, 'got an unexpected exception')

    def _then_result_validates(self, validator):
        try:
            validator(self.result)
        except ValueError as e:
            self.fail('result did not pass validation: {}'.format(e.args[0]))

    def _then_result_matches(self, result):
        self.assertEqual(self.result, result, 'results do not match')

    def then_invocation_failed_with(self, exception):
        self.assertIsInstance(self.exception, exception)

    def then_invocation_passed_with(self, result):
        self._then_there_was_no_exception()
        if isinstance(result, Validator):
            self._then_result_validates(result)
        else:
            self._then_result_matches(result)
