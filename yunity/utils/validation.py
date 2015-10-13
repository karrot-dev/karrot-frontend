from abc import ABCMeta, abstractmethod
from yunity.resources.http.status import HTTP_400_BAD_REQUEST


class ValidationFailure(Exception):
    def __init__(self, message, status=HTTP_400_BAD_REQUEST):
        self.message = message
        self.status = status


class Validator(object, metaclass=ABCMeta):
    def __and__(self, other):
        return AndThen(self, other)

    @abstractmethod
    def __call__(self, value):
        raise NotImplementedError


class AndThen(Validator):
    def __init__(self, *validators):
        self.validators = list(validators)

    def __call__(self, value):
        for validator in self.validators:
            value = validator(value)
        return value


class Each(Validator):
    def __init__(self, validator):
        self.validator = validator

    def __call__(self, values):
        if not hasattr(values, '__iter__'):
            raise ValidationFailure('not iterable')
        validated = []
        for value in values:
            validated.append(self.validator(value))
        return validated


class OfType(Validator):
    def __init__(self, clazz):
        self.clazz = clazz

    def __call__(self, value):
        if not isinstance(value, self.clazz):
            raise ValidationFailure('not a {}'.format(self.clazz.__name__))
        return value


class IsIn(Validator):
    def __init__(self, *elements):
        self.elements = set(elements)

    def __call__(self, value):
        if value not in self.elements:
            raise ValidationFailure('unknown element: allowed are "{}"'.format(', '.join(map(str, self.elements))))
        return value


class HasKey(Validator):
    def __init__(self, key):
        self.key = key

    def __call__(self, mapping):
        try:
            value = mapping.get(self.key)
        except AttributeError:
            raise ValidationFailure('element does not have keys')
        if value is None:
            raise ValidationFailure('missing key: {}'.format(self.key))
        return value


class ShorterThan(Validator):
    def __init__(self, maxlen):
        self.maxlen = maxlen

    def __call__(self, value):
        try:
            assert len(value) <= self.maxlen
        except AssertionError:
            raise ValidationFailure('element is longer than {}'.format(self.maxlen))
        except TypeError:
            raise ValidationFailure('element does not have length')
        return value


class IsReasonableLengthString(Validator):
    def __init__(self, maxlen=100000):
        self.maxlen = maxlen

    def __call__(self, value):
        (OfType(str) & ShorterThan(self.maxlen))(value)
        return value
