from functools import wraps

from django.http import JsonResponse

from yunity.api.ids import ids_uri_pattern_delim
from yunity.utils.request import JsonRequest
from yunity.resources.http.status import HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_201_CREATED, HTTP_403_FORBIDDEN, \
    HTTP_204_NO_CONTENT


class ApiBase(object):
    @classmethod
    def _json_response(cls, status, reason=None, data=None, **kwargs):
        """
        :type status: int
        :type reason: str
        :type data: dict
        :type kwargs: dict
        :rtype JsonResponse

        """
        payload = dict(kwargs)
        if reason is not None:
            payload["reason"] = reason
        if data is not None:
            payload.update(data)
        return JsonResponse(payload, status=status)

    @classmethod
    def validation_failure(cls, reason, **kwargs):
        """
        :type reason: str
        :type kwargs: dict
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_400_BAD_REQUEST, reason=reason, **kwargs)

    @classmethod
    def success(cls, data=None):
        """
        :type data: dict
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_200_OK, data=data)

    @classmethod
    def created(cls, data=None):
        """
        :type data: dict
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_201_CREATED, data=data)

    @classmethod
    def deleted(cls, data=None):
        """
        :type data: dict
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_204_NO_CONTENT, data=data)

    @classmethod
    def forbidden(cls, reason, **kwargs):
        """
        :type reason: str
        :type kwargs: dict
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_403_FORBIDDEN, reason=reason, **kwargs)

    @classmethod
    def error(cls, reason, status=HTTP_400_BAD_REQUEST, **kwargs):
        """
        :type reason: str
        :type status: int
        :type kwargs: dict
        :rtype JsonResponse
        :param status: HTTP response status, defined in status.py

        """
        return cls._json_response(status, reason=reason, **kwargs)


def body_as_json(parameters=None):
    """Decorator to validate that a request is in JSON and (optionally) has some specific keys in the JSON object
    The decorator modifies the request object, parsing the request.body field into a dictionary.
    Note: this decorator should only be used to decorate http-dispatch instance methods on subclasses of ApiBase.

    :type parameters: list
    """
    parameters = parameters or []

    def decorator(func):
        @wraps(func)
        def wrapper(api_base, request, *args, **kwargs):
            try:
                json_request = JsonRequest.from_http_request(request, parameters)
            except ValueError as e:
                return api_base.validation_failure(reason=str(e))

            return func(api_base, json_request, *args, **kwargs)
        return wrapper
    return decorator


def resource_as(param_name, item_type=str):
    """Decorator to convert a single resource from the URI into a given type.
    Note: this decorator should only be used to decorate http-dispatch instance methods on subclasses of ApiBase.

    :type param_name: str
    :type item_type: function :: str -> T
    """
    def decorator(func):
        @wraps(func)
        def wrapper(api_base, *args, **kwargs):
            raw_param = kwargs.get(param_name)
            if raw_param:
                try:
                    parsed_param = item_type(raw_param)
                except ValueError:
                    return api_base.validation_failure(reason='invalid type: {}'.format(raw_param))
                kwargs[param_name] = parsed_param

            return func(api_base, *args, **kwargs)
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
                        return api_base.validation_failure(reason='invalid type: {}'.format(raw_param))
                    else:
                        parsed_params.append(parsed_param)
                kwargs[param_name] = parsed_params

            return func(api_base, *args, **kwargs)
        return wrapper
    return decorator
