from abc import ABCMeta, abstractmethod
from django.core.exceptions import ValidationError
from django.core.validators import validate_email


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
            raise ValueError('not iterable')
        validated = []
        for value in values:
            validated.append(self.validator(value))
        return validated


class OfType(Validator):
    def __init__(self, clazz):
        self.clazz = clazz

    def __call__(self, value):
        if not isinstance(value, self.clazz):
            raise ValueError('not a {}'.format(self.clazz.__name__))
        return value


class IsIn(Validator):
    def __init__(self, *elements):
        self.elements = set(elements)

    def __call__(self, value):
        if value not in self.elements:
            raise ValueError('unknown element: allowed are "{}"'.format(', '.join(map(str, self.elements))))
        return value


class HasKey(Validator):
    def __init__(self, key):
        self.key = key

    def __call__(self, mapping):
        try:
            value = mapping.get(self.key)
        except AttributeError:
            raise ValueError('element does not have keys')
        if value is None:
            raise ValueError('missing key: {}'.format(self.key))
        return value


class ShorterThan(Validator):
    def __init__(self, maxlen):
        self.maxlen = maxlen

    def __call__(self, value):
        try:
            assert len(value) <= self.maxlen
        except AssertionError:
            raise ValueError('element is longer than {}'.format(self.maxlen))
        except TypeError:
            raise ValueError('element does not have length')
        return value


class IsEmail(Validator):
    def __call__(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise ValueError('not a valid email address')
        return value


class IsReasonableLengthString(Validator):
    def __init__(self, maxlen=100000):
        self.maxlen = maxlen

    def __call__(self, value):
        (OfType(str) & ShorterThan(self.maxlen))(value)
        return value
