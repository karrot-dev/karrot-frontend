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
