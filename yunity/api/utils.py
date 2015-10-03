from functools import wraps
from json import loads as load_json

from django.db.models import Model
from django.http import JsonResponse

from yunity.utils.status import HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_403_FORBIDDEN


class ApiBase(object):
    @classmethod
    def validation_failure(cls, message, status=HTTP_400_BAD_REQUEST):
        """
        :type message: str
        :type status: int
        :rtype JsonResponse

        """
        return JsonResponse({'validation_failure': message}, status=status)

    @classmethod
    def success(cls, data=None, status=HTTP_200_OK):
        """
        :type data: dict
        :type status: int
        :rtype JsonResponse

        """
        return JsonResponse(data or {}, status=status)

    @classmethod
    def forbidden(cls, message, status=HTTP_403_FORBIDDEN):
        """
        :type message: str
        :type status: int
        :rtype JsonResponse

        """
        return JsonResponse({'message': message}, status=status)

    @classmethod
    def error(cls, message, status=HTTP_400_BAD_REQUEST):
        """
        :type message: str
        :type status: int
        :rtype JsonResponse

        """
        return JsonResponse({'message': message}, status=status)


def json_request(expected_keys=None):
    """Decorator to validate that a request is in JSON and (optionally) has some specific keys in the JSON object.

    """
    expected_keys = expected_keys or []

    def decorator(func):
        @wraps(func)
        def wrapper(cls, request, *args, **kwargs):
            try:
                data = load_json(request.body.decode('utf8'))
            except ValueError:
                return ApiBase.error('incorrect json request')

            for expected_key in expected_keys:
                value = data.get(expected_key)
                if not value:
                    return ApiBase.validation_failure('missing key: {}'.format(expected_key))

            return func(cls, data, request, *args, **kwargs)

        return wrapper
    return decorator


def model_to_json(model, *fields):
    serialized = dict()
    for field in fields:
        value = getattr(model, field)
        if not value:
            continue
        if isinstance(value, Model):
            value = value.id
        serialized[field] = value
    return serialized
