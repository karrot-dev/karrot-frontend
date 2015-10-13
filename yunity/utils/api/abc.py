from functools import wraps

from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Model

from django.http import JsonResponse

from yunity.api.ids import ids_uri_pattern_delim
from yunity.utils.request import JsonRequest
from yunity.resources.http.status import HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_201_CREATED, HTTP_403_FORBIDDEN, \
    HTTP_204_NO_CONTENT, HTTP_409_CONFLICT, HTTP_404_NOT_FOUND


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
    def deleted(cls):
        """
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_204_NO_CONTENT)

    @classmethod
    def not_found(cls, reason):
        """
        :type reason: str
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_404_NOT_FOUND, reason=reason)

    @classmethod
    def forbidden(cls, reason):
        """
        :type reason: str
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_403_FORBIDDEN, reason=reason)

    @classmethod
    def conflict(cls, reason):
        """
        :type reason: str
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_409_CONFLICT, reason=reason)

    @classmethod
    def error(cls, reason):
        """
        :type reason: str
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_400_BAD_REQUEST, reason=reason)


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
    If the type is a model, look-up an intance of the model by id.
    Note: this decorator should only be used to decorate http-dispatch instance methods on subclasses of ApiBase.

    :type param_name: str
    :type item_type: function :: str -> T
    """
    def decorator(func):
        @wraps(func)
        def wrapper(api_base, *args, **kwargs):
            raw_param = kwargs.get(param_name)
            if raw_param:
                if type(item_type) == type(Model):
                    try:
                        parsed_param = item_type.objects.get(id=raw_param)
                    except ObjectDoesNotExist:
                        return api_base.not_found(reason='{} does not exist'.format(item_type.__class__.__name__))
                else:
                    try:
                        parsed_param = item_type(raw_param)
                    except ValueError:
                        return api_base.validation_failure(reason='parameter does not have type {}'.format(item_type.__name__))
                kwargs[param_name] = parsed_param

            return func(api_base, *args, **kwargs)
        return wrapper
    return decorator


def resource_as_list(param_name, item_type=str, delim=ids_uri_pattern_delim):
    """Decorator to split a multi-resource URI into a list of multiple resources.
    If the type is a model, look-up the intances of the model by ids.
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
                if type(item_type) == type(Model):
                    parsed_params = item_type.objects.filter(id__in=raw_params)
                    if len(parsed_params) != len(raw_params):
                        return api_base.not_found(reason='one or more {}s do not exist'.format(item_type.__class__.__name__))
                else:
                    try:
                        parsed_params = [item_type(raw_param) for raw_param in raw_params]
                    except ValueError:
                        return api_base.validation_failure(reason='one or more parameters does not have type {}'.format(item_type.__name__))
                kwargs[param_name] = parsed_params

            return func(api_base, *args, **kwargs)
        return wrapper
    return decorator
