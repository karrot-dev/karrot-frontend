from importlib import import_module
from json import dumps as dump_json
from json import loads as load_json


def json_stringify(data):
    return dump_json(data, sort_keys=True, separators=(',', ':')).encode("utf-8") if data else None


def content_json(response):
    return load_json(response.content.decode("utf-8"))


def is_test_resource(resource):
    return resource.startswith('test_')


def maybe_import(resource):
    try:
        return import_module(resource)
    except ImportError:
        return None
