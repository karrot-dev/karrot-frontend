from importlib import import_module
from json import dumps as dump_json


def json_stringify(data):
    """
    :type data: object
    :rtype: str
    """
    return dump_json(data, sort_keys=True, separators=(',', ':')).encode("utf-8") if data else None


def maybe_import(resource):
    """
    :type resource: str
    :rtype: module
    """
    try:
        return import_module(resource)
    except ImportError:
        return None
