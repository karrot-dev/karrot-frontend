from functools import wraps
from json import loads as load_json_string

from django.db.models import Model
from django.http import JsonResponse
from yunity.api.ids import ids_uri_pattern_delim

from yunity.utils.status import HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_403_FORBIDDEN, HTTP_201_CREATED


class ApiBase(object):
    @classmethod
    def validation_failure(cls, message, status=HTTP_400_BAD_REQUEST):
        """
        :type message: str
        :type status: int
        :rtype JsonResponse

        """
        return JsonResponse({'message': message}, status=status)

    @classmethod
    def success(cls, data=None, status=HTTP_200_OK):
        """
        :type data: dict
        :type status: int
        :rtype JsonResponse

        """
        return JsonResponse(data or {}, status=status)

    @classmethod
    def created(cls, data=None, status=HTTP_201_CREATED):
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


class JsonRequest(object):
    def __init__(self, http_request, json_body):
        self._http_request = http_request
        self._json_body = json_body

    @classmethod
    def from_http_request(cls, http_request, expected_keys):
        """
        :type http_request: HttpRequest
        :type expected_keys: list
        :rtype: JsonRequest
        :raises ValueError: if the request body is not valid JSON or one of the expected keys is missing

        """
        try:
            json_data = load_json_string(http_request.body.decode("utf-8"))
        except ValueError:
            raise ValueError('incorrect json request')

        for expected_key in expected_keys:
            value = json_data.get(expected_key)
            if not value:
                raise ValueError('missing key: {}'.format(expected_key))

        return cls(http_request, json_data)

    def __getattr__(self, item):
        if item == 'body':
            return self._json_body
        return getattr(self._http_request, item)


def body_as_json(expected_keys=None):
    """Decorator to validate that a request is in JSON and (optionally) has some specific keys in the JSON object.
    The decorator modifies the request object, parsing the request.body field into a dictionary.
    Note: this decorator should only be used to decorate http-dispatch instance methods on subclasses of ApiBase.

    :type expected_keys: list
    """
    expected_keys = expected_keys or []

    def decorator(func):
        @wraps(func)
        def wrapper(api_base, request, *args, **kwargs):
            try:
                json_request = JsonRequest.from_http_request(request, expected_keys)
            except ValueError as e:
                return api_base.validation_failure(str(e))

            return func(api_base, json_request, *args, **kwargs)
        return wrapper
    return decorator


def resource_as_list(param_name, item_type=str, delim=ids_uri_pattern_delim):
    """Decorator to split a multi-resource URI into a list of multiple resources.
    Note: this decorator should only be used to decorate http-dispatch instance methods on subclasses of ApiBase.

    :type param_name: str
    :type item_type: function :: str -> T
    :type delim: str
    """
    def decorator(func):
        @wraps(func)
        def wrapper(api_base, *args, **kwargs):
            raw_params = kwargs.get(param_name, '').split(delim)
            if raw_params:
                parsed_params = []
                for raw_param in raw_params:
                    try:
                        parsed_param = item_type(raw_param)
                    except ValueError:
                        return api_base.validation_failure('invalid type: {}'.format(raw_param))
                    else:
                        parsed_params.append(parsed_param)
                kwargs[param_name] = parsed_params

            return func(api_base, *args, **kwargs)
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
