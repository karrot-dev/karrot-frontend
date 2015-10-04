import json
from django.test import RequestFactory


class JSONRequestFactory(RequestFactory):
    def post(self, path, data=None, secure=False, **extra):
        if data:
            json_data = json.dumps(data).encode("utf-8")
        else:
            json_data = None
        return super(JSONRequestFactory, self).post(path, data=json_data,
                                         content_type="application/json",
                                         secure=False, **extra)

def content_json(response):
    return json.loads(response.content.decode("utf-8"))