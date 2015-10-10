from json import loads as load_json


def content_json(response):
    """
    :type response: HttpResponse
    :rtype: dict
    """
    try:
        return load_json(response.content.decode("utf-8"))
    except ValueError:
        raise ValueError('invalid json content in response')