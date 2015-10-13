from functools import wraps

from django.contrib.auth import get_user_model
from django.db.models import Model, Q

from django.http import JsonResponse

from yunity.api.ids import ids_uri_pattern_delim
from yunity.models import Chat as ChatModel
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


def json_request(func):
    """Decorator to validate that the body of a request is in JSON
    (gives a 400 response if the request body does not decode into valid json).

    The decorator modifies the request object, parsing the request.body field into a dictionary.

    Note: This decorator should only be used to decorate http-dispatch instance methods on subclasses of ApiBase.
    """

    @wraps(func)
    def wrapper(api_base, request, *args, **kwargs):
        try:
            request = JsonRequest.from_http_request(request)
        except ValueError:
            return api_base.validation_failure(reason='not a valid json request')

        return func(api_base, request, *args, **kwargs)
    return wrapper


def request_parameter(with_name, of_type=str):
    """Decorator to validate that the named parameter on the request body exists and passes some validation
    (gives a 400 response if any of the resources do not convert to the type).

    Note: This decorator should only be used on http-dispatch methods on ApiBase.

    :type with_name: str
    :type of_type: function :: str -> T
    """

    def decorator(func):
        @wraps(func)
        def wrapper(api_base, request, *args, **kwargs):
            try:
                request.body[with_name] = of_type(request.body[with_name])
            except KeyError:
                return api_base.validation_failure(reason='missing request parameter {}'.format(with_name))
            except ValueError as e:
                return api_base.validation_failure(reason=str(e))

            return func(api_base, request, *args, **kwargs)
        return wrapper
    return decorator


def uri_resource(with_name, of_type=str, with_multi_resource_separator=ids_uri_pattern_delim):
    """Decorator to parse one or more resources from an URI and convert them to a certain type
    (gives a 400 response if any of the resources do not convert to the type).

    If the type is a model, look-up the intances of the model by ids of the resources
    (gives a 404 response if any of the resources are not found).

    Note: This decorator should only be used on http-dispatch methods on ApiBase.

    :type with_name: str
    :type of_type: function :: str -> T
    :type with_multi_resource_separator: str
    """
    def decorator(func):
        @wraps(func)
        def wrapper(api_base, *args, **kwargs):
            raw_params = kwargs.get(with_name, '').split(with_multi_resource_separator)
            if raw_params:
                if type(of_type) == type(Model):
                    parsed_params = of_type.objects.filter(id__in=raw_params)
                    if len(parsed_params) != len(raw_params):
                        return api_base.not_found(reason='one or more {}s do not exist'.format(of_type.__class__.__name__))
                else:
                    try:
                        parsed_params = [of_type(raw_param) for raw_param in raw_params]
                    except ValueError:
                        return api_base.validation_failure(reason='one or more parameters does not have type {}'.format(of_type.__name__))
                kwargs[with_name] = parsed_params if len(parsed_params) > 1 else parsed_params[0]

            return func(api_base, *args, **kwargs)
        return wrapper
    return decorator


def permissions_required_for(resource_name):
    def has_permissions_for_user(request_user, user):
        return user.id == request_user.id

    def has_permissions_for_chat(request_user, chat):
        return ChatModel.objects \
            .filter(id=chat.id) \
            .filter(Q(participants=request_user.id) | Q(administrated_by=request_user.id)) \
            .exists()

    def has_permissions(request_user, resource):
        if isinstance(resource, get_user_model()):
            return has_permissions_for_user(request_user, resource)
        if isinstance(resource, ChatModel):
            return has_permissions_for_chat(request_user, resource)
        raise NotImplementedError

    def decorator(func):
        @wraps(func)
        def wrapper(api_base, request, *args, **kwargs):
            return func(api_base, request, *args, **kwargs) \
                if has_permissions(request.user, kwargs[resource_name]) \
                else api_base.forbidden(reason='user does not have rights to access {}'.format(resource_name))

        return wrapper
    return decorator
