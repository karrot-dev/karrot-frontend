from django.conf.urls import url
from django.http import HttpRequest
from django.views.generic import View

from yunity.api.ids import take_id_uri_pattern
from yunity.utils.api.abc import ApiBase


class Takes(ApiBase, View):
    def get(self, request):
        """list all takes of this user

        :type request: HttpRequest
        """
        raise NotImplementedError

    def post(self, request):
        """create a new take

        :type request: HttpRequest
        """
        raise NotImplementedError


class Take(ApiBase, View):
    def get(self, request, takeid):
        """return details about this take

        :type request: HttpRequest
        :type takeid: int
        """
        raise NotImplementedError

    def put(self, request, takeid):
        """modify the take, e.g. approve it

        :type request: HttpRequest
        :type takeid: int
        """
        raise NotImplementedError

    def delete(self, request, takeid):
        """unrequest the take

        :type request: HttpRequest
        :type takeid: int
        """
        raise NotImplementedError


urlpatterns = [
    url(r'^$', Takes.as_view()),
    url(r'^{takeid}/?$'.format(takeid=take_id_uri_pattern), Take.as_view()),
]
