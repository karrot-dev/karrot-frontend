from functools import wraps
from json import loads as load_json

from django.db.models import Model
from django.http import JsonResponse

from yunity.utils.status import HTTP_400_BAD_REQUEST, HTTP_200_OK


class ApiBase(object):
    @classmethod
    def model_to_json(cls, model, *fields):
        serialized = dict()
        for field in fields:
            value = getattr(model, field)
            if not value:
                continue
            if isinstance(value, Model):
                value = value.id
            serialized[field] = value
        return serialized

    @classmethod
    def validation_failure(cls, message, status=HTTP_400_BAD_REQUEST):
        """
        :type message: str
        :type status: int
        :rtype JsonResponse

        """
        return JsonResponse({'validation_failure': message}, status=status)

    @classmethod
    def success(cls, data, status=HTTP_200_OK):
        """
        :type data: dict
        :type status: int
        :rtype JsonResponse

        """
        return JsonResponse(data, status=status)

    @classmethod
    def error(cls, error, status=HTTP_400_BAD_REQUEST):
        """
        :type error: str
        :type status: int
        :rtype JsonResponse

        """
        return JsonResponse({'error': error}, status=status)


def json_request(expected_keys=None):
    """Decorator to validate that a request is in JSON and (optionally) has some specific keys in the JSON object.

    """
    expected_keys = expected_keys or []

    def decorator(func):
        @wraps(func)
        def wrapper(cls, request, *args, **kwargs):
            data = load_json(request.body.decode('utf8'))

            for expected_key in expected_keys:
                value = data.get(expected_key)
                if not value:
                    return ApiBase.validation_failure('missing key: {}'.format(expected_key))

            return func(cls, data, request, *args, **kwargs)

        return wrapper
    return decorator
