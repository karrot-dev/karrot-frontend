from django.utils.datetime_safe import datetime


ANY_INT = 'AnyInt'
ANY_STRING = 'AnyString'
DATETIME_AROUND_NOW = 'DatetimeAroundNow'


class DeepMatcher(object):
    @classmethod
    def _match_datetime_around_now(cls, actual, reason):
        actual_time = datetime.strptime(actual.split('.')[0], '%Y-%m-%dT%H:%M:%S')
        now = datetime.utcnow()
        difference = now - actual_time
        if abs(difference.total_seconds()) > 60:
            cls._raise_not_matching(actual, 'utc time string within 60 seconds of now', reason)

    @classmethod
    def _match_any_string(cls, actual, reason):
        if not isinstance(actual, str):
            cls._raise_not_matching(actual, 'any string', reason)

    @classmethod
    def _match_any_int(cls, actual, reason):
        if not isinstance(actual, int):
            cls._raise_not_matching(actual, 'any integer', reason)

    @classmethod
    def _match_objects(cls, actual, expected, reason):
        if actual != expected:
            cls._raise_not_matching(actual, expected, reason)

    @classmethod
    def _raise_not_matching(cls, actual, expected, reason):
        raise ValueError('got "{actual}", expected "{expected}", trace "{reason}"'.format(
            actual=actual,
            expected=expected,
            reason=reason,
        ))

    @classmethod
    def _fuzzy_match_dicts(cls, actual, expected, reason):
        for key, expected_value in expected.items():
            actual_value = actual.get(key)
            cls.fuzzy_match(actual_value, expected_value, '{reason}.{key}'.format(reason=reason, key=key))

    @classmethod
    def _fuzzy_match_lists(cls, actual, expected, reason):
        for i, (expected_item, actual_item) in enumerate(zip(expected, actual)):
            cls.fuzzy_match(actual_item, expected_item, '{reason}[{i}]'.format(reason=reason, i=i))

    @classmethod
    def _fuzzy_match_leaves(cls, actual, expected, reason):
        if expected == ANY_INT:
            cls._match_any_int(actual, reason)
        elif expected == ANY_STRING:
            cls._match_any_string(actual, reason)
        elif expected == DATETIME_AROUND_NOW:
            cls._match_datetime_around_now(actual, reason)
        else:
            cls._match_objects(actual, expected, reason)

    @classmethod
    def fuzzy_match(cls, actual, expected, reason=''):
        """
        :raises ValueError: if the arguments do not match
        """
        if isinstance(expected, dict) and isinstance(actual, dict):
            cls._fuzzy_match_dicts(actual, expected, reason)
        elif isinstance(expected, list) and isinstance(actual, list):
            cls._fuzzy_match_lists(actual, expected, reason)
        elif isinstance(expected, CustomMatcher):
            expected.compare(actual, reason)
        else:
            cls._fuzzy_match_leaves(actual, expected, reason)


class CustomMatcher(object):
    def __init__(self, comparator):
        self.comparator = comparator

    def compare(self, actual, reason):
        self.comparator(actual, reason)


class NotEqualsMatcher(CustomMatcher):
    def __init__(self, not_expected):
        super().__init__(self.compare)
        self.not_expected = not_expected

    def compare(self, actual, reason):
        if actual == self.not_expected:
            raise ValueError('got "{actual}" which was not expected, trace "{reason}"'.format(
                actual=actual,
                reason=reason,
            ))
