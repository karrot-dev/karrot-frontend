from django.http import JsonResponse

from yunity.resources.http.status import HTTP_400_BAD_REQUEST, HTTP_200_OK, HTTP_201_CREATED, HTTP_403_FORBIDDEN, \
    HTTP_204_NO_CONTENT, HTTP_409_CONFLICT, HTTP_404_NOT_FOUND


class ApiBase(object):
    @classmethod
    def _json_response(cls, status, reason=None, data=None, **kwargs):
        """
        :type status: int
        :type reason: str
        :type data: dict
        :type kwargs: dict
        :rtype JsonResponse

        """
        payload = dict(kwargs)
        if reason is not None:
            payload["reason"] = reason
        if data is not None:
            payload.update(data)
        return JsonResponse(payload, status=status)

    @classmethod
    def validation_failure(cls, reason, status=HTTP_400_BAD_REQUEST):
        """
        :type reason: str
        :type status: int
        :rtype JsonResponse

        """
        return cls._json_response(status=status, reason=reason)

    @classmethod
    def success(cls, data=None):
        """
        :type data: dict
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_200_OK, data=data)

    @classmethod
    def created(cls, data=None):
        """
        :type data: dict
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_201_CREATED, data=data)

    @classmethod
    def deleted(cls):
        """
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_204_NO_CONTENT)

    @classmethod
    def not_found(cls, reason):
        """
        :type reason: str
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_404_NOT_FOUND, reason=reason)

    @classmethod
    def forbidden(cls, reason):
        """
        :type reason: str
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_403_FORBIDDEN, reason=reason)

    @classmethod
    def conflict(cls, reason):
        """
        :type reason: str
        :rtype JsonResponse

        """
        return cls._json_response(status=HTTP_409_CONFLICT, reason=reason)

    @classmethod
    def error(cls, reason, status=HTTP_400_BAD_REQUEST):
        """
        :type reason: str
        :type status: int
        :rtype JsonResponse

        """
        return cls._json_response(status=status, reason=reason)
