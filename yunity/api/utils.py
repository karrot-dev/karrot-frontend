from django.http import JsonResponse


class ApiBase(object):
    @classmethod
    def success(cls, data, status=200):
        """
        :type data: dict
        :type status: int
        :rtype JsonResponse

        """
        return JsonResponse(data, status=status)

    @classmethod
    def error(cls, error, status=400):
        """
        :type error: str
        :type status: int
        :rtype JsonResponse

        """
        return JsonResponse({'error': error}, status=status)
