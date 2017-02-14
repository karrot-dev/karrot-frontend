from json import dumps as dump_json


def json_stringify(data):
    """
    :type data: object
    :rtype: str
    """
    return dump_json(data, sort_keys=True, separators=(',', ':')).encode("utf-8") if data else None
