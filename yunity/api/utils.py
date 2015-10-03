from django.http import JsonResponse


class ApiBase(object):

    STATUS_ERROR = 0
    STATUS_SUCCESS = 1
    STATUS_WARNING = 2

    def json_response(self, data=None, status=STATUS_SUCCESS, message=None):

        status_code = 400 if status == ApiBase.STATUS_ERROR else 200

        return JsonResponse({
            "data": data,
            "status": status,
            "message": message
        }, status=status_code)
