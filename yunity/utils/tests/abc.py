from unittest import TestCase
from yunity.utils.api.request import JsonRequestFactory


class BaseTestCase(TestCase):
    json_request_factory = JsonRequestFactory()

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
