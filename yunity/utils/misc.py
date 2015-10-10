from importlib import import_module
from json import dumps as dump_json, loads as load_json


def json_stringify(data):
    """
    :rtype: str
    """
    return dump_json(data, sort_keys=True, separators=(',', ':')).encode("utf-8") if data else None


def content_json(response):
    """
    :type response: HttpResponse
    :rtype: dict
    """
    try:
        return load_json(response.content.decode("utf-8"))
    except ValueError:
        raise ValueError('invalid json content in response')


def maybe_import(resource):
    """
    :type resource: str
    :rtype: module
    """
    try:
        return import_module(resource)
    except ImportError:
        return None
