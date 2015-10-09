from unittest import TestCase


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
