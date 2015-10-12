from json import loads as load_json


def content_json(response):
    """
    :type response: HttpResponse
    :rtype: dict
    """
    content = response.content.decode("utf-8")
    if not content:
        return {}

    try:
        return load_json(content)
    except ValueError:
        raise ValueError('invalid json content in response')