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


def post_with_json_body(expected_keys=None):
    """Decorator to validate that a request is in JSON and (optionally) has some specific keys in the JSON object.
    Note: this decorator should only be used to decorate http-dispatch instance methods on subclasses of ApiBase.

    """
    expected_keys = expected_keys or []

    def decorator(func):
        @wraps(func)
        def wrapper(api_base, request, *args, **kwargs):
            try:
                data = load_json(request.body.decode('utf8'))
            except ValueError:
                return api_base.error('incorrect json request')

            for expected_key in expected_keys:
                value = data.get(expected_key)
                if not value:
                    return api_base.validation_failure('missing key: {}'.format(expected_key))

            return func(api_base, data, request, *args, **kwargs)
        return wrapper
    return decorator


def get_with_list_param(param_name, item_type=str):
    """
    """
    def decorator(func):
        @wraps(func)
        def wrapper(api_base, *args, **kwargs):
            raw_params = kwargs.pop(param_name, '').split(',')
            parsed_params = []
            for raw_param in raw_params:
                try:
                    parsed_param = item_type(raw_param)
                except ValueError:
                    return api_base.validation_failure('invalid type: {}'.format(raw_param))
                else:
                    parsed_params.append(parsed_param)

            return func(api_base, parsed_params, *args, **kwargs)
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
