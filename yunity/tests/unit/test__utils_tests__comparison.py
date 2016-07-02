from yunity.utils.tests.abc import BaseRequestTestCase, NoResult
from yunity.utils.tests.comparison import DeepMatcher, ANY_INT, ANY_STRING


class DeepMatcherTestCase(BaseRequestTestCase):

    def test_fuzzy_match_succeeds_with_fuzzy_int_leaves(self):
        self.given_data(actual=1, expected=ANY_INT)
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_passed_with(NoResult())

    def test_fuzzy_match_fails_with_fuzzy_int_leaves(self):
        self.given_data(actual='foo', expected=ANY_INT)
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_failed_with(ValueError)

    def test_fuzzy_match_succeeds_with_fuzzy_string_leaves(self):
        self.given_data(actual='foo', expected=ANY_STRING)
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_passed_with(NoResult())

    def test_fuzzy_match_fails_with_fuzzy_string_leaves(self):
        self.given_data(actual=1, expected=ANY_STRING)
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_failed_with(ValueError)

    def test_fuzzy_match_succeeds_with_same_leaves(self):
        self.given_data('a', 'a')
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_passed_with(NoResult())

    def test_fuzzy_match_fails_with_different_leaves(self):
        self.given_data('a', 'b')
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_failed_with(ValueError)

    def test_fuzzy_match_succeeds_with_same_lists(self):
        self.given_data([1, 'b'], [1, 'b'])
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_passed_with(NoResult())

    def test_fuzzy_match_fails_with_different_lists(self):
        self.given_data([1, 'b'], [1, 'a'])
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_failed_with(ValueError)

    def test_fuzzy_match_succeeds_with_same_dicts(self):
        self.given_data({'a': 1, 'b': 2}, {'a': 1, 'b': 2})
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_passed_with(NoResult())

    def test_fuzzy_match_fails_with_different_dicts(self):
        self.given_data({'a': 1, 'b': 2}, {'b': 1, 'a': 2})
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_failed_with(ValueError)
