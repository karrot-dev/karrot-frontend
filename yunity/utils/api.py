from django.http import JsonResponse


class ApiBase(object):

    STATUS_ERROR = 0
    STATUS_SUCCESS = 1
    STATUS_WARNING = 2

    def json_response(self, data, status=STATUS_SUCCESS, message=None):
        return JsonResponse({
            "data": data,
            "status": status,
            "message": message
        })

