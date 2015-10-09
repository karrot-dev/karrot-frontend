from yunity.utils.test import BaseTestCase, DeepMatcher, json_stringify


class DeepMatcherTestCase(BaseTestCase):
    def test_fuzzy_match_succeeds_with_fuzzy_int_leaves(self):
        self.given_data(actual=1, expected=DeepMatcher.ANY_INT)
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_passed_with_no_result()

    def test_fuzzy_match_fails_with_fuzzy_int_leaves(self):
        self.given_data(actual='foo', expected=DeepMatcher.ANY_INT)
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_failed_with(ValueError)

    def test_fuzzy_match_succeeds_with_fuzzy_string_leaves(self):
        self.given_data(actual='foo', expected=DeepMatcher.ANY_STRING)
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_passed_with_no_result()

    def test_fuzzy_match_fails_with_fuzzy_string_leaves(self):
        self.given_data(actual=1, expected=DeepMatcher.ANY_STRING)
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_failed_with(ValueError)

    def test_fuzzy_match_succeeds_with_same_leaves(self):
        self.given_data('a', 'a')
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_passed_with_no_result()

    def test_fuzzy_match_fails_with_different_leaves(self):
        self.given_data('a', 'b')
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_failed_with(ValueError)

    def test_fuzzy_match_succeeds_with_same_lists(self):
        self.given_data([1, 'b'], [1, 'b'])
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_passed_with_no_result()

    def test_fuzzy_match_fails_with_different_lists(self):
        self.given_data([1, 'b'], [1, 'a'])
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_failed_with(ValueError)

    def test_fuzzy_match_succeeds_with_same_dicts(self):
        self.given_data({'a': 1, 'b': 2}, {'a': 1, 'b': 2})
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_passed_with_no_result()

    def test_fuzzy_match_fails_with_different_dicts(self):
        self.given_data({'a': 1, 'b': 2}, {'b': 1, 'a': 2})
        self.when_calling(DeepMatcher.fuzzy_match)
        self.then_invocation_failed_with(ValueError)


class JsonStringifyTestCase(BaseTestCase):
    def test_json_stringify_creates_json_from_dict(self):
        self.given_data({'a': 1, 'b': [2, 3], 'c': {'d': 4}})
        self.when_calling(json_stringify)
        self.then_invocation_passed_with(result=b'{"a":1,"b":[2,3],"c":{"d":4}}')

    def test_json_stringify_creates_none_from_none(self):
        self.given_data(None)
        self.when_calling(json_stringify)
        self.then_invocation_passed_with(result=None)
