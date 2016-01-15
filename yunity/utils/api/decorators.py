from django.contrib.auth import get_user_model
from django.db.models import Model, Q
from django.db.transaction import atomic
from functools import wraps
from yunity.api.ids import ids_uri_pattern_delim
from yunity.base.other_models import Group as GroupModel
from yunity.base.other_models import Item as ItemModel
from yunity.conversations.models import ConversationType, Conversation as ConversationModel
from yunity.resources.http.status import HTTP_400_BAD_REQUEST
from yunity.utils.request import JsonRequest
from yunity.utils.validation import ValidationFailure


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


def request_parameter(with_name, of_type=str, optional=False):
    """Decorator to validate that the named parameter on the request body exists and passes some validation
    (gives a 400 response if any of the resources do not convert to the type).

    Note: This decorator should only be used on http-dispatch methods on ApiBase.

    :type with_name: str
    :type of_type: function :: str -> T
    :type optional: bool
    """

    def decorator(func):
        @wraps(func)
        def wrapper(api_base, request, *args, **kwargs):
            try:
                request.body[with_name] = of_type(request.body[with_name])
            except KeyError:
                if not optional:
                    return api_base.validation_failure(reason='missing request parameter {}'.format(with_name))
            except ValidationFailure as e:
                return api_base.validation_failure(reason=e.message, status=e.status)

            return func(api_base, request, *args, **kwargs)

        return wrapper

    return decorator


def uri_resource(with_name, of_type=str, with_multi_resource_separator=ids_uri_pattern_delim, min_resources=1,
                 max_resources=1):
    """Decorator to parse one or more resources from an URI and convert them to a certain type
    (gives a 400 response if any of the resources do not convert to the type).

    If the type is a model, look-up the instances of the model by ids of the resources
    (gives a 404 response if any of the resources are not found).

    Returns a list of results except when exactly one result is expected, that is returned.
    The default behaviour expects exactly one result, set max_resources to None or an arbitrary
    limit to accept multiple.

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
                if len(raw_params) < min_resources:
                    return api_base.validation_failure(
                        reason='parameter count has to be at least {}'.format(min_resources))
                elif max_resources is not None and len(raw_params) > max_resources:
                    return api_base.validation_failure(
                        reason='parameter count has to be at most {}'.format(max_resources))
                if type(of_type) == type(Model):
                    parsed_params = of_type.objects.filter(id__in=raw_params)
                    if len(parsed_params) != len(raw_params):
                        return api_base.not_found(reason='one or more {}s do not exist'.format(of_type.__name__))
                else:
                    try:
                        parsed_params = [of_type(raw_param) for raw_param in raw_params]
                    except ValueError:
                        return api_base.validation_failure(
                            reason='one or more parameters does not have type {}'.format(of_type.__name__))
                kwargs[with_name] = parsed_params \
                    if max_resources is None or max_resources > 1 or min_resources != 1 \
                    else parsed_params[0]

            return func(api_base, *args, **kwargs)

        return wrapper

    return decorator


def login_required(func):
    """Decorator to require the requesting user to be logged in.

    gives a 403 error response if the user is not logged in.

    Note: This decorator should only be used on http-dispatch methods on ApiBase.
    """

    @wraps(func)
    def wrapper(api_base, request, *args, **kwargs):
        return func(api_base, request, *args, **kwargs) \
            if request.user.is_authenticated() \
            else api_base.forbidden(reason='a logged in user is required')

    return wrapper


def chat_participants_user_modifiable(chat_arg_name):
    """Decorator to detect if a chat participant list might be changed via user request or not
    (gives a 403 response when this is not allowed)

    """

    def decorator(func):
        @wraps(func)
        def wrapper(api_base, request, *args, **kwargs):
            return func(api_base, request, *args, **kwargs) \
                if kwargs[chat_arg_name].type in [ConversationType.USER_MULTICHAT] \
                else api_base.forbidden(reason='the participants are not to be modified')

        return wrapper

    return decorator


def permissions_required_for(resource_name):
    """Decorator to validate that the requesting user has permissions to access a resource with the given name
    (gives a 403 response if the user isn't authorized to access the resource).

    Note: This decorator should only be used on http-dispatch methods on ApiBase.

    :type resource_name: str
    """

    def has_permissions_for_user(request_user, user):
        return user.id == request_user.id

    def has_permissions_for_group(request_user, group):
        return True

    def has_permissions_for_chat(request_user, chat):
        return ConversationModel.objects \
            .filter(id=chat.id) \
            .filter(Q(participants=request_user.id)) \
            .exists()

    def has_permissions_for_item(request_user, item):
        return item.id == request_user.id

    def has_permissions(request_user, resource):
        if isinstance(resource, get_user_model()):
            return has_permissions_for_user(request_user, resource)
        if isinstance(resource, ConversationModel):
            return has_permissions_for_chat(request_user, resource)
        if isinstance(resource, GroupModel):
            return has_permissions_for_group(request_user, resource)
        if isinstance(resource, ItemModel):
            return has_permissions_for_item(request_user, resource)
        raise NotImplementedError

    def decorator(func):
        @wraps(func)
        def wrapper(api_base, request, *args, **kwargs):
            return func(api_base, request, *args, **kwargs) \
                if has_permissions(request.user, kwargs[resource_name]) \
                else api_base.forbidden(reason='user does not have rights to access {}'.format(resource_name))

        return wrapper

    return decorator


def rollback_on(exception, reason, status=HTTP_400_BAD_REQUEST):
    """Decorator to roll back a transaction if an exception occurs and return an error response instead.

    Note: This decorator should only be used on http-dispatch methods on ApiBase.

    :type exception: Exception
    :type reason: str
    :type status: int
    """

    def decorator(func):
        @wraps(func)
        def wrapper(api_base, *args, **kwargs):
            # noinspection PyBroadException
            try:
                with atomic():
                    return func(api_base, *args, **kwargs)
            except exception:
                return api_base.error(reason=reason, status=status)

        return wrapper

    return decorator
