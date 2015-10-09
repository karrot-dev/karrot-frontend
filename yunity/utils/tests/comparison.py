from django.utils.datetime_safe import datetime


class DeepMatcher(object):
    ANY_INT = 'AnyInt'
    ANY_STRING = 'AnyString'
    DATETIME_AROUND_NOW = 'DatetimeAroundNow'

    @classmethod
    def _fuzzy_match_dicts(cls, actual, expected, reason):
        for key, expected_value in expected.items():
            actual_value = actual.get(key)
            reason += key+"."
            cls.fuzzy_match(actual_value, expected_value, reason)

    @classmethod
    def _fuzzy_match_lists(cls, actual, expected, reason):
        for expected_item, actual_item in zip(expected, actual):
            reason += "[]"
            cls.fuzzy_match(actual_item, expected_item, reason)

    @classmethod
    def _fuzzy_match_leaves(cls, actual, expected):
        if expected == cls.ANY_INT:
            if not isinstance(actual, int):
                raise ValueError('expected any integer, got {}'.format(actual))
        elif expected == cls.ANY_STRING:
            if not isinstance(actual, str):
                raise ValueError('expected any string, got {}'.format(actual))
        elif expected == cls.DATETIME_AROUND_NOW:
            actual_time = datetime.strptime(actual.split(".")[0], "%Y-%m-%dT%H:%M:%S")
            now = datetime.utcnow()
            difference = now - actual_time
            if abs(difference.total_seconds()) > 60:
                raise ValueError('expected an UTC time string within 60 seconds of now, got {}'.format(actual))
        else:
            if actual != expected:
                raise ValueError('expected {}, got {}'.format(expected, actual))

    @classmethod
    def fuzzy_match(cls, actual, expected, reason=""):
        """
        :raises ValueError: if the arguments do not match
        """
        if isinstance(expected, dict) and isinstance(actual, dict):
            cls._fuzzy_match_dicts(actual, expected, reason)
        elif isinstance(expected, list) and isinstance(actual, list):
            cls._fuzzy_match_lists(actual, expected, reason)
        else:
            try:
                cls._fuzzy_match_leaves(actual, expected)
            except ValueError as e:
                raise ValueError("Reason: "+reason+", "+e.args[0])
